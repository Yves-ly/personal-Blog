# 朝文夕拾

一个前后端分离的个人博客系统

## 在线预览

https://yves0428.top/

## 项目截图

![首页]
(https://pic1.imgdb.cn/i/034ZtbX2F49A70tR9JxNoA.png)

![博客页]
(https://pic1.imgdb.cn/i/034ZtbVZIGzFmOd58vYFcn.png)

![夜间模式与管理登陆界面]
(https://pic1.imgdb.cn/i/034ZtbWRCgSXwjSbUXbtFI.png)

![英文效果与编写管理界面]
(https://pic1.imgdb.cn/i/034ZtbVSZJR5PMoF4oNHXA.png)

## 技术栈

1. 前端
- Vue 3
- Vite
- Vue Router
- vue-i18n
- marked（Markdown 渲染）

2. 后端
- Node.js
- Express
- MySQL
- JWT（用户认证）
- bcryptjs（密码加密）

## 功能特性

- [x] 用户注册 / 登录（邀请码机制）
- [x] 文章管理（Markdown 编辑器 + 实时预览）
- [x] 全站内容搜索
- [x] 深色 / 浅色主题切换
- [x] 中英文国际化
- [x] 响应式布局（适配移动端）
- [x] 页面切换动画
- [x] 文章分类


## 环境要求

- Node.js >= 18
- MySQL >= 8.0
- npm >= 9

## 快速启动

1. 克隆项目

```bash

git clone https://github.com/Yves-ly/personal-Blog
cd personal-Blog
git checkout develop

```

2. 启动前端

```bash

cd client
npm install
npm run dev

```
3. 初始化数据库

```sql

CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

```

```bash

mysql -u root -p blog < blog_backup.sql

```

4. 启动后端
```bash

cd server
npm install
cp .env.example .env
#此处需要手动打开.env文件并补充对应内容
npm run dev

```
5. 本地访问
打开 http://localhost:<端口>

## 作者

杨梓童
GitHub: @Yves-ly