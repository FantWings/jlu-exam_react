var httpRequest

//AJAX
function submitQuestion() {
    //AJAX支持判断函数
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest()
    } else if (window.ActiveXObject) {
        httpRequest = new ActiveXObject()
    }
    //服务器地址，开启异步交互
    httpRequest.open("POST", "https://api.htips.cn/jlu_helper/v1/get_answer",true)
    //本地调试用，没什么问题别去开
    // httpRequest.open("POST", "http://127.0.0.1:5000/v1/get_answer",true)
    httpRequest.setRequestHeader("Content-type", "application/json")
    //构建数据结构
    var data = {
        "question_data": document.querySelector("#question_feid").value,
        "token": document.querySelector("#token").value
    }
    //发送数据
    httpRequest.send(JSON.stringify(data))
    httpRequest.onreadystatechange = response
    showNotice('服务器正在处理您的数据，这可能需要一点时间，请稍等....','loading')
    document.querySelector('#submit').innerText = "别着急"
}

//返回数据处理
function response() {
    if (httpRequest.readyState==4) {
        if(httpRequest.status==200) {
            //解包数据内容
            var answer = JSON.parse(httpRequest.response)

            // 数据回显开关
            // console.log(answer)

            //如果数据状态为success，代表后端处理成功，移交给答案处理函数
            if (answer['status']=='success') {
                actionSuccess()
                successNotice(answer['answers']['paper_id'],answer['answers']['ip_addr'])

                if (answer['answers']['single']) {
                    showAnswers(answer['answers']['single'],'single')
                }

                if (answer['answers']['multi'].length != 0) {
                    showAnswers(answer['answers']['multi'],'multi')
                }

                if (answer['answers']['judge'].length != 0) {
                    showAnswers(answer['answers']['judge'],'judge')
                }
            }
            //如果数据状态为error，代表用户发送数据有误，移交给错误显示函数
            if (answer['status']=='error') {
                showNotice(answer['error_msg'],'error')
                document.querySelector('#submit').innerText = "重新提交"
            }
        }
        else {
            //其余一律显示为服务器通讯失败
            showNotice('与服务器通讯失败！可能是服务器离线或出错，请联系开发者。','error')
            document.querySelector('#submit').innerText = "重新提交"
        }
    }
}

//提示条显示函数
function showNotice(content,notice_type) {
    let warn = document.querySelector('.notice_bar')
    let warn_text = document.querySelector('.notice_bar small')
    let type = document.querySelector('#msg_title')
    warn.style.display = "block"
    if (notice_type == 'error') {
        type.innerText = "错误"
        warn.style.background = "rgb(250, 78, 78)"
    } else if (notice_type == 'loading') {
        type.innerText = "请稍等"
        warn.style.background = "#638eeb"
    }
    warn_text.innerHTML = content
}

function successNotice(paper_id,ip_addr) {
    let warn = document.querySelector('.notice_bar')
    let warn_text = document.querySelector('.notice_bar small')
    let type = document.querySelector('#msg_title')
    warn.style.display = "block"
    type.innerText = ""
    warn.style.textAlign = "center"
    let user_info = document.createElement('small')
    user_info.innerText = `试卷号（UUID）：${paper_id} 丨 IP地址：${ip_addr}`
    warn.appendChild(user_info)
    warn_text.innerHTML = "本工具仅供交流学习用途，请适度使用！任何因本工具导致的问题将不会为你付任何责任！<br>"
    warn_text.style.fontSize = '18px'
    warn.style.background = "rgb(250, 78, 78)"
}

//答案处理函数
function showAnswers(answer_data,master_type) {
    //创建答案容器，赋予class
    let answer_contain = document.createElement('div')
    answer_contain.className = 'answer_contain'
    
    //将容器插入到页面
    container = document.querySelector('.container')
    container.appendChild(answer_contain)

    //创建标题
    let q_type = document.createElement('h3')
    q_type.className = 'q_type'

    if (master_type == 'single') {
        q_type.innerText = '单选题'
    } else if (master_type == 'multi') {
        q_type.innerText = '多选题'
    } else if (master_type == 'judge') {
        q_type.innerText = '判断题'
    }
    
    //将标题加入容器
    container = document.querySelector('.container')
    answer_contain.appendChild(q_type)

    //开始处理答案内容
    answer_data.forEach(element => {
        // console.log(element)

        //构建每题的答案列表
        let answer_block = document.createElement('div')
        answer_block.className = 'answer_block'

        //构建标准答案答案元素
        let answer = document.createElement('span')
        if (master_type == 'multi') {
            answer.className = 'multi_answer'
        } else {
            answer.className = 'answer'
        }
        answer.innerText = element['answer']

        //构建题号
        let q_id = document.createElement('span')
        q_id.className = 'q_id'
        q_id.innerText = element['quesion_id']

        //构建题目类型
        let question_type = document.createElement('small')
        question_type.className = 'question_type'
        question_type.innerText = element['question_type']
        
        //将题目类型插入到题号元素一起
        q_id.appendChild(question_type)

        //构建题目数据
        let question = document.createElement('span')
        question.className = 'question'
        question.innerText = element['question']

        //额外创建一个div，将题号，题目数据插入
        let answer_data = document.createElement('div')
        answer_data.appendChild(q_id)
        answer_data.appendChild(question)

        //将数据插入到答案列表中
        answer_block.appendChild(answer)
        answer_block.appendChild(answer_data)

        //最终将答案列表插入至容器
        answer_contain.appendChild(answer_block)
    })
}

function actionSuccess() {
    document.querySelector('.title h2').innerText = '问卷解析完成'
    // document.querySelector('#menu').innerHTML = '<a href="javascript:void(0)" onclick="actionBack()">返回首页</a>丨<a href="help" target="_blank" rel="noopener noreferrer">需要帮助</a>丨<a href="http://dec.jlu.edu.cn/learning/entity/student/student_toOuterSystem.action?key=homework" target="_blank" rel="noopener noreferrer">作业管理</a>'
    document.querySelector('#menu').innerHTML = '<a href="/" target="__blank">返回首页</a>丨<a href="help" target="_blank" rel="noopener noreferrer">需要帮助</a>丨<a href="http://dec.jlu.edu.cn/learning/entity/student/student_toOuterSystem.action?key=homework" target="_blank" rel="noopener noreferrer">作业管理</a>'
    document.querySelector('#notice').innerHTML = "需要解析其他问卷？<br>"
    document.querySelector('#form_contain').style.display = 'none'
    document.querySelector('#submit').style.display = 'none'
}

function actionBack() {
    document.querySelector('.answer_contain').remove()
}