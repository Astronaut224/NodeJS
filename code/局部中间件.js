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
app.get('/hello', mw2, mw1, (req, res) => res.send('hello page'))
app.get('/about', [mw1, mw2], (reeq, res) => res.send('about page'))

app.get('/user', (req, res) => res.send('user page'))

app.listen(80, ()=> {
  console.log('express server running at 127.0.0.1');
})