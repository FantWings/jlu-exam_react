import React from 'react'
import ReactDOM from 'react-dom'
import 'whatwg-fetch'
import "./styles.css";

// 服务器地址
var server_url = 'https://api.htips.cn/jlu_helper/v1'
// 开发测试用，正常情况下勿动
// var server_url = 'http://127.0.0.1:5000/v1'

function Bars(props) {
    return (
        <span className={'bar ' + props.status}>
            <h3 id="msg_tittle">{props.title}</h3>
            <small id="msg_text">{props.text}</small>
        </span>
    )
}

function Notices(props) {
    return (
        <span id="notices" className="bar error">
            <p>本工具仅供交流学习用途，请适度使用！任何因本工具导致的问题将不会为你付任何责任！</p>
            <small id="info">试卷号（UUID）：{props.paper_id} 丨 IP地址：{props.ip_addr}</small>
        </span>
    )
}

function Title() {
    return (
        <div id='title'>
            <h2>吉林大学作业小助手</h2>
            <UsageCount/>
            <small id="menu">
                <a href="https://github.com/FantWings/jlu_homework_helper" target="_blank" rel="noopener noreferrer">需要帮助</a>
                <a href="http://dec.jlu.edu.cn/learning/entity/student/student_toOuterSystem.action?key=homework" target="_blank" rel="noopener noreferrer">作业管理</a>
            </small>
        </div>
    )
}

class UsageCount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: false,
            text: '使用统计功能未启用'
        }
    }

    componentDidMount() {
        fetch(server_url + '/get_user_count').then(
            (response) => response.json().then(json => {
                this.setState({count: json.count})
            }).catch(
                this.setState({count: '统计数据获取失败'})
            )
        )
    }

    render() {
        if (this.state.count) {
            return(
                <p id="s_title"><small id="notice">你身边最牛逼的作业小助手，累计已被<span> {this.state.count} </span>位同学使用</small></p>
            )
        }else{
            return(
            <p id="s_title"><small id="notice">你身边最牛逼的作业小助手，{this.state.text}</small></p>
            )
        }
    }
}

function EZforms() {
    return(
        <form method="post" name="form">
        <textarea name="question" id="question_feid" required placeholder="将获取到的试卷数据粘贴到这里，如果您不清楚如何获取数据，请点击“需要帮助”"></textarea>
            <div id="key_feid">
                <h4>执行密钥</h4>
                <input type="password" name="token" id="token" required placeholder="为了避免恶意请求，请输入执行密钥" />
                <p><SendQuestion /></p>
            </div>
        </form>
    )
}


class SendQuestion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 'ready',
            text: '提交'
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleData = this.handleData.bind(this)
    }

    handleClick(e) {
        e.preventDefault()
        let data = {
            "question_data": document.querySelector("#question_feid").value,
            "token": document.querySelector("#token").value
        }
        
        fetch(server_url + '/get_answer',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors',
            credentials: 'omit',
        }).then(
            (response) => response.json().then(json => this.handleData(json))
        ).catch(e => {
            ReactDOM.render(<Bars status='error' title='连接错误' text='服务器连接失败，可能是网络连接超时，如果您确定不是网络问题，请联系开发者 微信@FantWings'/>,document.querySelector("#bar_container"))
            this.setState({status:'failure',text:'重试一次'})
        })

        ReactDOM.render(<Bars status='info' title='处理中' text='服务器正在处理你的数据，这可能需要一点时间，请稍后....'/>,document.querySelector("#bar_container"))
        this.setState({status:'sending',text:'别着急'})
    }

    handleData(data) {
        if (data.status === 'success') {
            this.setState({status:'success',text:'再次解析'})
            ReactDOM.render(<Notices paper_id={data.paper_id} ip_addr={data.ip_addr}/>,document.querySelector("#bar_container"))
            ReactDOM.render(<AnswerProccesser data={data.answers}/>,document.querySelector("#answer_container"))
            window.scrollTo(0,0)
        } else if (data.status === 'error') {
            ReactDOM.render(<Bars status={data.status} title='错误' text={data.error_msg}/>,document.querySelector("#bar_container"))
            this.setState({status:'failure',text:'重试一次'})
        } else {
            ReactDOM.render(<Bars status={data.status} title='服务器内部错误' text={data.error_msg}/>,document.querySelector("#bar_container"))
            this.setState({status:'failure',text:'重试一次'})
        }
    }

    render(){
        return(
            <a href="/#" onClick={this.handleClick} id="submit" className={this.state.status}>{this.state.text}</a>
        )
    }
}

function AnswerProccesser(props) {
    let rows = []
    for (const key in props.data) {
        if (Object.keys(props.data[key].answer).length > 0) {
            rows.push(<AnswerContain answer_data={props.data[key]} type_id={key} key={key}/>)
        }
    }
    rows.push(<span id='liner' key='liner'><span id='liner_text'>再次解析</span></span>)
    return(rows)
}

function AnswerContain(props) {
    return (
        <div className='answer_contain'>
            <h3 className="q_type">{props.answer_data.type_name}</h3>
            <AnswerList data={props.answer_data.answer} type_id={props.type_id}/>
        </div>
    )
}

function AnswerList(props) {
    let rows = []
    for (const i in props.data) {
        rows.push(<AnswerBlock data={props.data[i]} key={i} type_id={props.type_id}/>)
    }
    return(rows)
}


class AnswerBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isSelected: false
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e) {
        e.preventDefault()
        this.setState({isSelected:!this.state.isSelected})
    }

    render() {
        return(
            <div className="answer_block" id={this.state.isSelected ? "selected": ""} onClick={this.handleClick}>
                <span className={'answer ' + this.props.type_id}>{this.props.data.answer}</span>
                <div>
                    <span className="q_id">
                        <small id="question_id">{this.props.data.question_id}</small>
                        <small id="question_type">{this.props.data.question_type}</small>
                    </span>
                    <span className="question">{this.props.data.question}</span>
                </div>
            </div>
        )
    }
}

class Footer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isConnected: null,
            text: '正在联系服务器....'
        }
    }

    componentDidMount() {
        fetch(server_url + '/ping').then(
            (response) => {
                if(response.status === 200) {
                    this.setState({isConnected: true, text:'服务器连接已建立'})
                    console.log('嗯，服务看起来还没炸。')
                }
            }).catch((e) => {
                this.setState({isConnected: false, text:'与服务器通讯失败'})
                console.log('日！服务器又双叒叕炸了！')
            })
    }

    render() {
        return(
            <footer>
                <ul>
                    <li>版本 version 2.1a（<a href="https://reactjs.org/">ReactJS</a>）</li>
                    <li><span id={this.state.isConnected ? 'connected':'disconnected'} className='ping'></span>{this.state.text}</li>
                    <li>适用于 吉林大学弘成科技发展有限公司 学生作业系统</li>
                    <li>源代码：<a href="https://github.com/FantWings/jlu_homework_helper">GitHub</a></li>
                </ul>
            </footer>
        )
    }
}

function App() {
    return(
        <div className='container'>
            <Title/>
            <div id="bar_container"></div>
            <div id="answer_container"></div>
            <EZforms/>
            <Footer/>
        </div>
    )
}

ReactDOM.render(<App/>, document.querySelector("#root"))


console.log(
    `
    +--------------------------------+
    |   Build with ReactJS v17.0.1   |
    +--------------------------------+

    嗨！你发现了我的小秘密！
    其实我也不知道为什么当初会有这样的想法冒着可能被开除的风险去写这个奇葩的工具，
    很幸运的是，风险与收益往往并存，这个工具被同学甚至老师们们广泛使用开来了。
    这个工具的诞生某种程度上减少了老师去找答案给学生，学生省得在老师提供的答案中翻找的烦恼吧？
    不过你想想上面的师生操作，其实这个毕业证水分太大了。

    老师为了高毕业率，赚取更多提成，给学生提供答案
    学生为了顺利毕业，不去钻研知识，只想着去抄答案
    
    这真的是几年前的你所向往的结局吗？

    一句建议，保持学习精神，主动探索新知识，多动手去试，就像我写这个工具
    从一无所知，到Python数据处理，到Flask前后混合，再到现在的ReactJS前后分离。
    中途不知道经历了多少挫折，这个工具就是我努力学习和实践的结晶。
    
    这毕业证就是垃圾，和花钱买来的没什么区别。
    社会认可度非常低，如果你有凭着这个毕业证找工作的想法，建议还是报考学位吧。

    QQ:1330440011 欢迎探讨，让我们一起进步！

     - 终生学习，学无止境 -
     
    `
)