def json_res(success=None, data="", msg="", code=200):
    """
    返回数据处理函数
    * success:      执行是否成功（布尔值）
    data:           回调数据（Json）
    msg:            附加消息（字符串）
    code:           返回码（数值）
    """
    resp = {
        'success': success,
        'msg': msg,
        'data': data,
        'code': code
    }
    return resp
