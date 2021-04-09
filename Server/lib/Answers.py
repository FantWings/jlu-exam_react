import re


def getAnswers(original_data):
    """
    答案解析函数，用于解析作业试题答案

    * original_data：考试系统的试卷数据
    """

    pre_proccess = {
        "single": [],
        "multi": [],
        "judge": [],
        "combound": [],
    }

    for q in original_data['data']['questions']:
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

    data = [
        {
            "type_name": "选择题",
            "answer": Select(pre_proccess).single()
        },
        {
            "type_name": "多选题",
            "answer": Select(pre_proccess).multi()
        },
        {
            "type_name": "判断题",
            "answer": judge(pre_proccess)
        },
        {
            "type_name": "完形填空",
            "answer": Select(pre_proccess).combound()['fill_in']
        },
        {
            "type_name": "阅读理解",
            "answer": Select(pre_proccess).combound()['read_understand']
        },
    ]

    return data


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

            # 削除题目中的HTML标签
            pattern = re.compile(r'<[^>]+>', re.S)
            answer['question'] = pattern.sub('', value['stem'])

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

            # 削除题目中的HTML标签
            pattern = re.compile(r'<[^>]+>', re.S)
            answer['question'] = pattern.sub('', value['stem'])

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

        # 削除题目中的HTML标签
        pattern = re.compile(r'<[^>]+>', re.S)
        answer['question'] = pattern.sub('', value['stem'])

        answers.append(answer)
    return answers
