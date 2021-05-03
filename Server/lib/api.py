def json_res(data=None, msg=None, code=0):
    """
    返回数据处理函数
    data:           回调数据（Json）
    msg:            附加消息（字符串）
    code:           返回码（数值）
    """
    resp = {
        'code': code,
        'msg': msg,
        'data': data
    }
    return resp
