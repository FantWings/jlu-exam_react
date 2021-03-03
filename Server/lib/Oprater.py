import json
from sqlalchemy import func

from Server.lib.sql import db
from Server.lib.model import Paper
from Server.lib.api import json_res
from Server.lib.Answers import getAnswers


def addPapers(paper_data):
    """
    添加一张试卷数据

    * paper_data（试卷数据）

    """

    # 将试卷号存储到变量
    paper_id = paper_data['data']['answerPaperRecordId']
    paper = Paper.query.get(paper_id)

    # 判断数据库内是否已经有这份试卷了
    if paper is None:
        try:
            # 调用答案解析函数，解析答案，存储到变量
            try:
                answers = getAnswers(paper_data)
            except Exception:
                return json_res(True, msg='你输入的试卷数据不正确或试卷数据不完整，解析失败！',
                                code=400)

            # 将试卷号、提交者IP地址、原试卷数据、答案数据写入数据库
            new_paper = Paper(
                id=paper_id,
                submit_ip=paper_data['data']['sourceIp'],
                original=json.dumps(paper_data['data']['questions']),
                answer=json.dumps(answers)
                )

            db.session.add(new_paper)
            db.session.commit()

            # 返回处理结果以及试卷号
            return json_res(True, data=paper_id, code=200)
        # 异常处理
        except Exception as e:
            return json_res(True, msg=e, code=500)

    paper.used_count = Paper.used_count + 1
    db.session.commit()
    return json_res(True, data=paper_id,
                    code=200,
                    msg="答案已在数据库中，直接从数据库中返回答案数据")


def getPapers(paper_id, user_token):
    """
    从数据库获取试卷（含答案）

    * paper_id（试卷号）
    * user_token（用户密钥，用于判断这个用户是否是这个试卷的所有者）
    """

    paper = Paper.query.get(paper_id)

    # 判断数据库内是否已经有这份试卷了
    if paper is None:
        return json_res(False, msg='试卷不存在，请检查试卷号是否正确。', code=404)
    else:
        response = {
            'paper_id': paper.id,
            'paper_name': paper.paper_name,
            'submit_time': paper.submit_time,
            'isOwner': user_token == paper.owner,
            'answers': json.loads(paper.answer)
        }

        return json_res(True, data=response, code=200)


def setPaperName(paper_id, new_name, token):
    """
    命名试卷名称

    * paper_id： 试卷UUID
    * new_name： 试卷名称
    * token：所有者密钥
    """
    paper = Paper.query.get(paper_id)
    if token == paper.owner:
        try:
            paper.paper_name = new_name
            db.session.commit()
            return json_res(True, msg="试卷数据更新成功！")
        except Exception as e:
            return json_res(False, msg=e, code=500)
    else:
        return json_res(False, msg='你不是该试卷的所有者，无法改动试卷数据！', code=404)


def updatePaperOwner(paper_id, token):
    """
    为试卷设定/更新所有者，为其后续提供修改权限

    * paper_id（试卷号）
    * token（用户Token）
    """
    try:
        paper = Paper.query.get(paper_id)
        paper.owner = token
        db.session.commit()
    except Exception as e:
        print(e)
        pass


def getPaperCount():
    """
    统计数据库内的试卷被使用次数之和

    """
    result = db.session.query(func.sum(Paper.used_count)).scalar() or 0
    return int(result)


def getPaperList(limit, index):
    """
    从数据库获取试卷列表
    """
    results = Paper.query.limit(limit).offset(
        (index - 1) * limit).with_entities(
        Paper.id,
        Paper.paper_name,
        Paper.submit_time).all()
    totalPage = Paper.query.count() / limit
    return json_res(True, data=results, msg={'pageTotal': totalPage})
