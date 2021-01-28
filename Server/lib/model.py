from Server.lib.sql import db
from datetime import datetime


class Paper(db.Model):
    __tablename__ = "papers"
    id = db.Column(db.String(64), primary_key=True, comment='试卷号')
    paper_name = db.Column(db.String(64), nullable=True, comment='试卷名称')
    owner = db.Column(db.String(64), nullable=True, comment='试卷名称')
    submit_ip = db.Column(db.String(15),
                          default='0.0.0.0',
                          comment='提交者IP地址')
    submit_time = db.Column(db.DateTime,
                            default=datetime.now,
                            comment='提交时间')
    original = db.Column(db.JSON, nullable=False, comment='原试卷数据')
    answer = db.Column(db.JSON, nullable=False, comment='答案数据')
    used_count = db.Column(db.Integer, default=1, comment='该试卷的被使用次数')


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(64), nullable=False)
