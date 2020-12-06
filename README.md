参考 b 站实战课程：20-Vue 实战项目：电商管理系统（Element-UI）https://www.bilibili.com/video/BV1EE411B7SU

前端项目源码：https://github.com/mmmying/vue-management-system

后端项目源码：https://github.com/mmmying/vue-management-system-server

接口文档：https://github.com/mmmying/vue-management-system-server/blob/master/%E7%94%B5%E5%95%86%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0%20API%20%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3.md

## 本地运行步骤

### 1.搭建环境

1）安装 PHPStudy，PHPStudy 是一套集成环境，下载地址 https://m.xp.cn/

2）创建数据库，导入数据
创建数据库 mydb.sql，用户 admin，密码 123456，将数据库文件 mydb.sql 导入到该数据库，mydb.sql 文件地址：https://github.com/mmmying/vue-management-system-server/tree/master/db

![phpstudy](src\assets\phpstudy.png)

3）运行后端项目

```
npm install
node app.js
```

显示如下即启动成功

![运行后端项目](src\assets\node_app.js.png)

4）运行前端项目

```
npm install
npm run dev
```
