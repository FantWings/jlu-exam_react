import json
import os
from datetime import timedelta

base_dir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    """
    FLASK配置发布函数
    """
    # 从config.json读取数据库配置
    config = json.load(open('config.json'))
    if config.get('use_sql'):
        # 拼接SQL URI
        database_uri = "mysql://%s:%s@%s:%s/%s" % (
            config['sql_username'],
            config['sql_password'],
            config['sql_hostname'],
            config.get('sql_port', '3306'),
            config['sql_database']
        )
    else:
        # 回退使用MYSQLITE
        database_uri = False

    # SQLALCHEMY配置
    SQLALCHEMY_DATABASE_URI = database_uri or 'sqlite:///' + os.path.join(
                                               base_dir, 'sqlite.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 禁用ASCII编码
    JSON_AS_ASCII = False

    # 设置SESSION安全密钥
    SECRET_KEY = os.urandom(24)

    # 设置SESSION有效期
    PERMANENT_SESSION_LIFETIME = timedelta(days=31)
