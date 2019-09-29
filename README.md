# 前端工程说明文档

### 一、先决条件

1. 工程基于 vue-cli 搭建，并针对目前我们实际的工作开发环境下，做了业务处理的通用框架，架构已经实现前后端开发阶段的分离
2. 该工程依赖 node / npm 环境请自行搭建，部署前请一并检出依赖包
3. 请确保至少部署了一个后端工程，基础框架目录在 SVN 中自行检出
4. 请在开始全新工程前配置对应的权限，角色及授权用户
5. 建议开发工具为 VSCode 并安装好相应的扩展（Sublime Text 也可以不过易用程度较低）

### 二、工程目录结构

其中 **/** 开头的为文件夹，这里只列出了需要关注的目录结构，全部的目录结构请自行对比工程目录（从 SVN 检出最新工程）

```
┬─ /node_modules
├─ /public
│  ├─ favicon.ico
│  ├─ index.html
├─ /src
│  ├─ /assets
│  ├─ /components
│  ├─ /views
│  ├─ App.vue
│  ├─ common.js
│  ├─ main.js
│  ├─ router.js
│  ├─ store.js
├─ /tests
├─ .env
└─ vue.config.js
```

### 三、下面对目录文件进行说明

```
目录：
  /dist         编译后文件目录
  /node_modules 依赖包目录
  /public       公共资源目录
  /assets       静态资源目录
  /components   组件目录
  /views        视图目录
  /tests        测试目录

js 文件：
  main.js       是程序入口，关键的配置
  common.js     是基础支撑包
  router.js     前端路由注册中心
  store.js      前端状态管理
  const.js      常量定义汇总
  util.js       工具包

css 预编译文件：
  main.scss     主要样式表

vue 文件：
  App.vue       是主页面框架
  views         目录下的视图文件为个子模块的页面
  error         目录下为错误页视图

根目录下：
  vue.config.js 编译打包工具 webpack 的核心配置文件（依托于 vue-cli 3.x）
  .env          文件为通用环境变量配置文件
```

### 四、整个工程代码我已经重构，如需要开启新工程只需要

1. 复制完整工程并更改名称
2. 修改 package.json 文件中关于原工程名称部分（name）
3. 修改 .env 文件，并将 VUE_APP_NAME 值改为对应工程名称（如：bf-web）
4. 修改 vue.config.js 文件并将本地、测试及生产环境相关服务器信息配置替换
5. 删除或重新编写 views 目录下相关文件
6. 路由配置依托与后端的权限平台返回，后端代码我已封装好（请参考 bf-web 工程）
7. 在 main.js 文件中需要配置 JSESSIONID（仅开发阶段）

### 五、下面介绍快速配置工程的技巧

我已经在后端 web 工程预留了 IndexController 并配置了 token.action，当前后端分离开发阶段，负责开发前端的同学只需要调一下后端的 token 接口，即可直接在页面拿到当前的 token 值（本质上为 JSESSIONID），然后将得到的值配置在 main.js 中的 token 赋值表达式中即可，现在请求首页即可正常响应了。

如：

```
// main.js 文件配置 token
Const.HEADERS.token = store.state.token = '85AE2DA5C80F7AB2D7599C3671D622D0'

// .env 文件配置
VUE_APP_NAME='bf-web'
VUE_APP_TITLE='基础前端框架 - 示例'

// vue.config.js 文件配置服务器代理
target: 'http://172.29.3.117'
```

### 六、介绍一下开发阶段的常用 npm 命令

```
# 用来启动开发时环境
npm run serve

# 用来打包编译文件，并集成到后端工程中
npm run build

# 更新依赖包资源
npm update
```

### 七、以下是对编程风格的一些要求

1. 前后端分离项目后端一律采用 Rest-ful 接口，接口为多个单词组合的情况请用 "\_" 做分隔，正例："query_user_permissions"
2. 权限配置中，在 util.js 文件中做了如下限制："@" 开头的权限一律为联动一级菜单，一般不用做路由作用，特例如 "@Home" 需要表示为视图的情况下，请自行添加 event
3. 前端工程代码一律采用 ES6 / SCSS 语法，不要混杂 ES5 或 LESS 语法代码，开发风格总体保持一直
4. 约定大于配置，请组织文件时按工程标准区分组件、视图或资源目录，另对工程核心或关键业务代码在本工程 README.md 文档中进行说明标注
5. 代码应该是总体保持纵向发展的，一行代码不要过长，同意函数不要过长，另外代码应该趋于松散状态，便于阅读
6. 代码应做到自解释，注释不宜过多，且应该出现在关键地方（如复杂业务逻辑或位运算）

### 八、后话

严格来说目前的前后端分离只实现到开发阶段，由于后端工程的局限性，并未搭建前端集成环境，部署后仍然启动运行 web 工程（tomcat war 包部署或者 jar 包直接运行）
