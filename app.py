from flask import Flask, request, make_response
import json
from flask_cors import cross_origin
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

conf = json.load(open('config.json', 'r'))
if conf['use_sql'] is True:
    try:
        import pymysql
    except Exception:
        print("pymysql库缺失，你需要使用pip install pymysql命令安装这个库后才能启用统计功能")
        conf['use_sql'] = False


@app.route('/v1/ping', methods=["GET"])
@cross_origin()
def ping():
    return(make_response('success', 200))


@app.route('/v1/get_user_count', methods=["GET"])
@cross_origin()
def get_user_count():
    if conf['use_sql'] is True:
        return(make_response(db().get_count(), 200))
    else:
        return(make_response({'count': False}, 200))


@app.route('/v1/get_answer', methods=["POST"])
@cross_origin()
def index():
    if request.method == "POST":
        submit_info = request.get_json()
        resp = {}
        if submit_info["token"] is conf['token']:
            try:
                data = json.loads(submit_info['question_data'])
                answers = answer_proccesser(data['data']['questions'])
                resp['success'] = True
                resp['answers'] = answers
                resp['paper_id'] = data['data']['answerPaperRecordId']
                resp['ip_addr'] = data['data']['sourceIp']
                if conf['use_sql'] is True:
                    db().insert_user_data(data['data']['sourceIp'])
                return make_response(resp, 200)
            except Exception as e:
                error_msg = "你输入的试卷数据不正确或试卷数据不完整，解析失败！"
                print('[错误捕捉] %s' % (e))
                resp['success'] = False
                resp['error_msg'] = error_msg
                return make_response(resp, 400)
        else:
            error_msg = "密钥不正确，请重新输入正确的密钥！"
            resp['success'] = False
            resp['error_msg'] = error_msg
            return make_response(resp, 401)


class db:
    def __init__(self):
        self.db = pymysql.connect(
            host=conf['sql_host'],
            user=conf['sql_username'],
            password=conf['sql_password'],
            database=conf['sql_basename'])
        self.cursor = self.db.cursor(pymysql.cursors.DictCursor)

    # def __del__(self):
    #     self.db.close()

    # def insert_data(self, uuid, answers, raw):
    #     '''插入数据库参数，接受值：试卷UUID，试卷答案数据，试卷原数据'''
    #     sql = """INSERT INTO `jlu_exam`.`exam`(`uuid`, `answers`, \
    # `raw_data`)
    #     VALUES ("%s", "%s", %s")""" % (uuid, answers, raw)
    #     try:
    #         self.cursor.execute(sql)
    #         self.db.commit()
    #     except Exception as e:
    #         print('[数据库存储失败] %s' % (e))
    #         self.db.rollback()

    # def insert_user_data(self, ip_addr):
    #     '''插入数据库参数，接受值：用户IP地址'''
    #     sql = """INSERT INTO `jlu_exam`.`users`(`ip_addr`) \
    #     VALUES ("%s")""" % (ip_addr)
    #     try:
    #         self.cursor.execute(sql)
    #         self.db.commit()
    #     except Exception as e:
    #         self.db.rollback()

    def get_count(self):
        '''获取工具使用次数'''
        sql = """SELECT COUNT(ip_addr) FROM users"""
        self.cursor.execute(sql)
        return {'count': self.cursor.fetchone()['COUNT(ip_addr)']}


def answer_proccesser(data):
    pre_proccess = {
        "single": [],
        "multi": [],
        "judge": [],
        "combound": [],
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
                pre_proccess['combound'].append(q['subqustionList'])
            except Exception:
                pass

    answers = {
        "1 single": {
            "type_name": "选择题",
            "answer": Select(pre_proccess).single()
        },
        "2 multi": {
            "type_name": "多选题",
            "answer": Select(pre_proccess).multi()
        },
        "3 judge": {
            "type_name": "判断题",
            "answer": judge(pre_proccess)
        },
        '4 fill_in': {
            "type_name": "完形填空",
            "answer": Select(pre_proccess).combound()['fill_in']
        },
        '5 read_understand': {
            "type_name": "阅读理解",
            "answer": Select(pre_proccess).combound()['read_understand']
        },
    }

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
                "question_id": "第%s题" % (key),
                "answer": self.answer_dict[value['answer']['id']],
                "uuid": value['questionId']
            }

            if len(value['stem']) >= 200:
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
                "question_id": "第%s题" % (key),
                "answer": gg,
                "uuid": value['questionId']
            }

            if len(value['stem']) >= 200:
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
                    "question_id": "第%s题" % (key),
                    "question": value['stem'].lstrip('<p>').rstrip('</p>'),
                    "answer": self.answer_dict[value['answer']['id']],
                    "uuid": value['questionId']
                }
                if i is key:
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
            "question_id": "第%s题" % (key),
            "answer": answer_dict[value['answer']['id']],
            "uuid": value['questionId']
        }

        if len(value['stem']) >= 200:
            answer['question'] = "* 这个题目含有影响排版的混合数据，反正你也会不关心题目内容，这里不再显示 *"
        else:
            answer['question'] = value['stem'].lstrip('<p>').rstrip('</p>')

        answers.append(answer)
    return answers
