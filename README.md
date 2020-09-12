## 吉林大学作业解析工具

**吉林大学在线教育作业解析工具，从 HTTP 包中直接获取试卷/作业答案**

![screenshot](static/img/demo.png)

适用范围：吉林大学弘成科技发展有限公司开发的学生作业系统

程序语言：Python3，Flask

环境需求：3.X 或以上的 Python && 1.1.X 以上的 Flask 库版本

## 部署方法

- 请确保系统内安装了 3.X 或以上的 Python 版本，使用`python -v`查看 Python 版本。
- 安装 flask 扩展 `pip install flask`
- 使用命令将代码 clone 至本地：
  `git clone https://github.com/FantWings/jlu_homework_helper.git`
- 运行程序 `flask run`
  - 默认监听 127.0.0.1，如果需要任意网络访问请使用参数-h 0.0.0.0（非常不建议）
