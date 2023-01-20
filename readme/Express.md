# Express

Express 是用于快速创建服务器的第三方模块。

## 初体验

### 基本使用

安装Express

```
npm install express
```

创建服务器，监听客户端请求，并返回内容。

```javascript
const express = require('express')
const app = express()

// 监听客户端的 GET 和 POST请求，并向客户端响应具体内容
app.get('/user', (req, res) => {
  res.send({ name: 'zs', age: 20, gender: 'male' })
})

app.post('/user', (req, res) => {
  res.send('请求成功')
})

// req.query可以获取到客户端发过来的查询参数
app.get('/', (req, res) => {
  console.log('req.query: ', req.query);
  res.send(req.query)
})

// req.params 是动态匹配到的 URL 参数，默认是空对象
// 这里的 :id 是一个动态的参数
app.get('/user/:id/:username', (req, res) => {
  console.log('req.params: ', req.params);
})

app.listen(80, () => {
  console.log('express server running at 127.0.0.1');
})
```

### 托管静态资源

通过 `express.static()` 方法可以创建静态资源服务器，对外开放访问静态资源。

Express 在指定的目录中查找文件，并对外提供资源的访问路径，存放静态文件的目录名不会出现在 URL 中。

```javascript
const express = require('express')
const app = express()

app.use(express.static('public'))
```

**托管多个静态资源目录**

- 如果要托管多个静态资源目录，多次调用 express.static() 函数

- 访问静态资源时，会根据托管顺序查找文件

- 可为静态资源访问路径添加前缀

```javascript
const express = require('express')
const app = express()

// 访问资源时要添加路径public
app.use('/public', express.static('public'))
app.use(express.static('image'))

app.listen(80, () => {
  console.log('express server running at 127.0.0.1');
})

/* 访问 http://127.0.0.1:80/index.html
    原本应该现在public目录下查找index.html文件，找不到再到image目录下找，
    现在因为public目录下的资源要加上路径public，所以会访问到image目录下的index.html
  访问 http://127.0.0.1:80/public/index.html 会访问到public目录下的index.html */
```

## Express路由

创建路由模块

```javascript
const express = require('express')
const router = express.Router()

// 挂载具体路由
router.get('/user/list', (req, res) => {
  res.send('Get user list')
})

router.post('/user/add', (req, res) => {
  res.send('Add new user')
})

// 向外导出路由对象
module.exports = router
```

注册路由模块

```javascript
const express = require('express')
const router = require('./express创建路由')

const app = express()

// 注册路由模块，添加访问前缀
app.use('/api', router)

app.listen(80, () => {
  console.log('http:/127.0.0.1');
})
```

## Express中间件

中间件是流程的中间处理环节，在服务器接收到请求后可以调用中间件进行预处理。

中间件是一个函数，包含`req, res, next`三个参数，`next`参数把流转关系交给下一个中间件或路由。

**注意事项**

- 在注册路由之前注册中间件（错误级别的中间件除外）
- 中间件可以连续调用多个，多个中间件共享`req`、`res`对象
- 需要调用`next()`函数，`next()`函数后面别写代码

### 全局中间件

通过`app.use()`定义的中间件是全局中间件。

```javascript
const express = require('express')
const app = express()

// 定义第一个全局中间件
app.use((req, res, next) => {
  console.log('调用了第1个全局中间件');
  next()
})

// 定义第二个全局中间件
app.use((req, res, next) => {
  console.log('调用了第2个全局中间件');
  next()
})

app.get('/user', (req, res) => {
  res.send('User page')
})

app.listen(80, () => {
  console.log('http://127.0.0.1');
})
```

### 局部中间件

局部中间件没有用`app.use()`定义。

```javascript
const express = require('express')
const app = express()

// 定义第一个局部中间件函数
const mw1 = (req, res, next) => {
  console.log('调用了第1个局部生效中间件');
  next()
}

// 定义第二个局部中间件函数
const mw2 = (req, res, next) => {
  console.log('调用了第2个局部生效中间件');
  next()
}

// 定义调用局部中间件的两种方式
// 调用第2个再调用第1个
app.get('/hello', mw2, mw1, (req, res) => res.send('hello page'))
// 调用调用第1个再调用第2个
app.get('/about', [mw1, mw2], (reeq, res) => res.send('about page'))

app.get('/user', (req, res) => res.send('user page'))

app.listen(80, ()=> {
  console.log('express server running at 127.0.0.1');
})
```

### 中间件分类

1. 应用级别的中间件

- 通过 `app.use()` 或 `app.get()` 或 `app.post()` ，绑定到 `app` 实例上的中间件

2. 路由级别的中间件

- 绑定到 `express.Router()` 实例上的中间件，叫做路由级别的中间件。用法和应用级别中间件没有区别。应用级别中间件是绑定到 `app` 实例上，路由级别中间件绑定到 `router` 实例上。

```javascript
const app = express()
const router = express.Router()

router.use(function (req, res, next) {
  console.log(1)
  next()
})

app.use('/', router)
```

3. 错误级别的中间件

- 用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题
- 错误级别中间件的处理函数中，必须有 4 个形参，形参顺序从前到后分别是 `(err, req, res, next)` 。
- 错误级别的中间件必须注册在所有路由之后

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  throw new Error('服务器内部发生了错误！')
  res.send('Home page.')
})

// 定义错误级别的中间件，捕获整个项目的异常错误，从而防止程序的崩溃
app.use((err, req, res, next) => {
  console.log('发生了错误！' + err.message)
  res.send('Error：' + err.message)
})

app.listen(80, function () {
  console.log('Express server running at http://127.0.0.1')
})
```

4. Express 内置中间件

- `express.static` 快速托管静态资源的内置中间件，例如： HTML 文件、图片、CSS 样式等（无兼容性）
- `express.json` 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
- `express.urlencoded` 解析 URL-encoded 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）

```javascript
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
```

