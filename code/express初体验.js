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
