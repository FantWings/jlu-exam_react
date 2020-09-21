var httpRequest

function submitQuestion() {
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest()
    } else if (window.ActiveXObject) {
        httpRequest = new ActiveXObject()
    }
    
    httpRequest.open("POST", "http://127.0.0.1:5000",true)
    httpRequest.setRequestHeader("Content-type", "application/json")
    var data = {
        "question_data": document.querySelector("#question_feid").value,
        "token": document.querySelector("#token").value
    }
    httpRequest.send(JSON.stringify(data))
    httpRequest.onreadystatechange = response
}

function response() {
    if (httpRequest.readyState==4) {
        if(httpRequest.status==200) {
            var answer = JSON.parse(httpRequest.response)
            console.log(answer)
            if (answer['status']=='success') {
                showAnswer(answer['answers'])
            }
            if (answer['status']=='error') {
                showError(answer['error_msg'])
            }
        }
        else {
            showError('与服务器通讯失败！')
        }
    }
}

function showError(error) {
    // console.log(error)
    let warn = document.querySelector('.warn')
    let warn_text = document.querySelector('.warn small')
    warn.style.display = "block"
    warn_text.innerHTML = error
}



function showAnswer(answer_data) {
    let answer_contain = document.createElement('div')
    answer_contain.className = 'answer_contain'

    let q_type = document.createElement('h3')
    q_type.className = 'q_type'

    let answer_block = document.createElement('div')
    answer_block.className = 'answer_block'

    let answer = document.createElement('span')
    answer.className = 'answer'

    let q_id = document.createElement('span')
    q_id.className = 'q_id'

    let question = document.createElement('span')
    question.className = 'question'

    let question_type = document.createElement('small')
    question_type.className = 'question_type'

    if (answer_data['single']) {
        q_type.innerText = '单选题'
        contain = document.querySelector('.container')
        answer_contain.appendChild(q_type)
        contain.appendChild(answer_contain)

        answer_data['single'].forEach(element => {
            console.log(element)
            answer.innerText = element['answer']
            q_id.innerText = element['quesion_id']
            question_type.innerText = element['question']
            
            q_id.appendChild(question_type)

            answer_block.appendChild(answer)
            answer_block.appendChild(q_id)
            answer_block.appendChild(question)

            answer_contain.appendChild(answer_block)
        })
    }
}