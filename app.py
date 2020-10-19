from flask import Flask, render_template, request, url_for, make_response
import json
app = Flask(__name__)


@app.route('/', methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("index.html")
    if request.method == "POST":
        submit_info = request.form.to_dict()
        conf = json.load(open('config.json', 'r'))
        if submit_info.get("token") == conf['token']:
            try:
                data = json.loads(submit_info['question'])
                print("\n* 已处理来自[ %s ]的试卷分析请求，返回答案数据给用户" %
                      (data['data']['sourceIp']))
                answers = answer_proccesser(
                    data['data']['questions'], data['data']['answerPaperRecordId'], data['data']['sourceIp'])
                return render_template('resaults.html', answer=answers)
            except Exception:
                error_msg = "你输入的试卷数据不正确或试卷数据不完整，解析失败！"
                print("\n* 用户数据内容错误，返回错误消息")
                return render_template('index.html', error=error_msg)
        else:
            error_msg = "密钥不正确，请重新输入正确的密钥！"
            print("\n* 用户密钥错误，返回错误消息")
            return render_template('index.html', error=error_msg)


def answer_proccesser(data, paper_id, ip_addr):
    pre_proccess = {
        "single": [],
        "multi": [],
        "judge": [],
    }

    for q in data:
        if q['questiontypename'] == '单选':
            pre_proccess['single'].append(q)
        if q['questiontypename'] == '多选':
            pre_proccess['multi'].append(q)
        if q['questiontypename'] == '判断':
            pre_proccess['judge'].append(q)
        if q['questiontypename'] == '复合':
            try:
                pre_proccess['combound'] = []
                pre_proccess['combound'].append(q['subqustionList'])
            except Exception:
                pass

    answers = {
        "paper_id": paper_id,
        "ip_addr": ip_addr,
        "single": Select(pre_proccess).single(),
        "multi": Select(pre_proccess).multi(),
        "judge": judge(pre_proccess),
    }

    if "combound" in pre_proccess:
        answers['combound'] = Select(pre_proccess).combound()

    return answers


class Select:
    def __init__(self, question):
        self.question = question
        self.answer_dict = {
            "0": "A",
            "1": "B",
            "2": "C",
            "3": "D",
            "4": "E",
            "5": "F",
            "6": "G"
        }

    def single(self):
        answers = []
        for key, value in enumerate(self.question['single']):
            key = key + 1
            answer = {
                "question_type": value['questiontypename'],
                "quesion_id": "第%s题" % (key),
                "answer": self.answer_dict[value['answer']['id']]
            }

            if len(value['stem']) >= 300:
                answer['question'] = "* 这个题目含有影响排版的混合数据，反正你也会不关心题目内容，这里不再显示 *"
            else:
                answer['question'] = value['stem'].lstrip('<p>').rstrip('</p>')

            answers.append(answer)
        return answers

    def multi(self):
        answers = []
        for key, value in enumerate(self.question['multi']):
            key = key + 1
            gg = ""
            for ans in value['answer']['idList']:
                gg = gg + self.answer_dict[ans]
            answer = {
                "question_type": value['questiontypename'],
                "quesion_id": "第%s题" % (key),
                "answer": gg
            }

            if len(value['stem']) >= 300:
                answer['question'] = "* 这个题目含有影响排版的混合数据，反正你也会不关心题目内容，这里不再显示 *"
            else:
                answer['question'] = value['stem'].lstrip('<p>').rstrip('</p>')

            answers.append(answer)
        return answers

    def combound(self):
        answers = {
            "fill_in": [],
            "read_understand": []
        }
        for content in self.question['combound']:
            i = len(content)
            for key, value in enumerate(content):
                key = key + 1
                answer = {
                    "question_type": value['questiontypename'],
                    "quesion_id": "第%s题" % (key),
                    "question": value['stem'].lstrip('<p>').rstrip('</p>'),
                    "answer": self.answer_dict[value['answer']['id']]
                }
                if i == key:
                    answer["is_last"] = True
                if value['stem'] == "":
                    answer['question_master_type'] = "fill_in"
                    answer['question'] = "本题为完形填空，原文章太长无法显示"
                    answers['fill_in'].append(answer)
                else:
                    answer['question_master_type'] = "read_understand"
                    answers['read_understand'].append(answer)
        return answers


def judge(question):
    answer_dict = {
        "1": "对",
        "2": "错"
    }
    answers = []
    for key, value in enumerate(question['judge']):
        key = key + 1
        answer = {
            "question_type": value['questiontypename'],
            "quesion_id": "第%s题" % (key),
            "answer": answer_dict[value['answer']['id']]
        }

        if len(value['stem']) >= 300:
            answer['question'] = "* 这个题目含有影响排版的混合数据，反正你也会不关心题目内容，这里不再显示 *"
        else:
            answer['question'] = value['stem'].lstrip('<p>').rstrip('</p>')

        answers.append(answer)
    return answers
