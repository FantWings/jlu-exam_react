## 吉林大学作业解析工具

**这个公司开发的考试系统居然在考试期间回传答案数据....于是做了这么一个阴间工具，从 HTTP 包中直接获取试卷/作业答案，并且以简洁易懂的方式展现给有需要的同学，仅供学习交流使用。**

> 现已使用现学现用的 ReactJS 重写了前端，优化一些前端的体验。

![screenshot](public/demo.png)
适用范围：吉林大学弘成科技发展有限公司开发的学生作业系统

**前端**：[ReactJS](https://reactjs.org/)，[Fetch](https://github.com/github/fetch)  
**后端**：[Python3](https://www.python.org/)，[Flask](https://github.com/pallets/flask)

## 使用方法

**在线使用：https://jlu.htips.cn**

### 操作步骤

- 在操作之前，请先点击开始考试，进入考试界面
- 按下 F12 键，打开浏览器调试工具（**如果你用的是苹果电脑自带的 Safari 浏览器请看下面，其他浏览器请跳过**）
  - Safari 默认关闭了开发者模式，请先[启用开发模式](https://jingyan.baidu.com/article/9113f81bfa87586b3214c7d4.html)，才可调出 F12 界面
  - 开发者模式启用后，在页面按下键盘 Option+Command+A 组合键，继续下一步。
- 选择"网络（Network）"，在筛选器上筛选“XHR”
- 在题目上随便选一个答案，点击“保存”
- 这时可以在网络工具下看到出现一个“SubmitAnserPaper”
- 选中“SubmitAnserPaper”，点“响应（Response）”
- 按下键盘 `Ctrl+A`（苹果电脑 `Command+A`）全选，并按下`Ctrl+C`（苹果电脑 `Command+C`）复制全部内容。
- 将复制的数据`Ctrl+V`（苹果电脑 `Command+V`）粘贴至解析工具，输入执行密钥，点击提交，即可解析答案。

## 前后分离

**为了方便维护，后续版本已做前后端分离，前端统一通过 API 与后端交互，你可以：**

- 将前端文件挪移至任意位置。
- 单独下载前端，自己修改成喜欢的样式。
- 单独下载前端，让其和任意位置的后端交互

## 统计支持

**现工具正式使用 MYSQL 作为数据存储后端，具有基础用户试卷数据的 CRUD 功能，修改`config.json`配置的`use_sql`值为`true`,即使用 MySQL，设置为`false`则使用 SQLite，用于统计工具的被使用次数，记录用户提交过的试卷数据以及答案。**

## 下载源码试一试

如果你对源码感兴趣或者你也想试试改进这个工具，下面将指引你如何去做：

**前端环境需求：8.10 或以上的 Node 版本 && 5.6 以上的 npm 程序版本**  
**后端环境需求：3.X 或以上的 Python && 1.1.X 以上的 Flask 库版本**

### 下载源码

- 使用命令将代码 clone 至本地：
  `git clone https://github.com/FantWings/jlu_homework_helper.git`

### 前端

- 修改项目文件夹 `src/api.js` 内的后端地址为你自己的后端地址（例：http://localhost:5000）
- 测试&构建前端页面
  - 使用 `yarn start` 启动开发服务器
  - 使用 `yarn build` 构建静态前端页面
- 构建的前端静态页面会生成在 `build` 文件夹，可将这些文件放到 OSS 或者外部的网页服务器上供其他人使用。
- 注：请勿将 yarn start 启动的开发服务器暴露给外网，开发服务器的文件是没有经过优化的。

### 后端

- 请确保系统内安装了 3.X 或以上的 Python 版本，使用`python -v`查看 Python 版本。
- 在根目录执行`pip install Server/requirements.txt`安装 flask 所需要的扩展
  - 注意 mysqlclient 需要依赖 mysql-config，如果你是 Ubuntu/Debian 系统，请注意安装 libmysqlclient-dev
- 使用`cp .config config`命令将模板复制成一份可用的配置文件，并修改里面的 token 字段为你想要的 token（越长越好），这个是对应页面的执行密钥
- 运行 `flask run`启动开发后端。
  - 默认监听 127.0.0.1:5000，如果需要任意网络访问请使用参数-h 0.0.0.0（安全角度非常不建议）
- 运行`uwsgi --socket 0.0.0.0:5000 --protocol=http -p 3 -w wsgi:app` 启动生产环境后端。
  - 建议配合 NGINX 来启动后端更为安全。
