const express = require('express')
const router = require('./express创建路由')

const app = express()

// 注册路由模块，添加访问前缀
app.use('/api', router)

app.listen(80, () => {
  console.log('http:/127.0.0.1');
})
