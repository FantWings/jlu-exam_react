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
    if(httpRequest.readyState==4) {
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
    }
}

function showError(error) {
    // console.log(error)
    let warn = document.querySelector('.warn')
    let warn_text = document.querySelector('.warn small')
    warn.style.display = "block"
    warn_text.innerHTML = error
}


function createElement(element_name,class_name) {
    let ele = document.createElement(element_name)
    ele.class_name = class_name
    return ele
}

function showAnswer(answer_data) {
    let answer_contain = createElement('div','answer_contain')
    let q_type = createElement('h3','q_type')
    let answer_block = createElement('div','answer_block')
    let answer = createElement('span','answer')
    let q_id = createElement('span','q_id')
    let question = createElement('span','question')

    console.log('Bingo')
    if (answer_data['single']){

    }
}