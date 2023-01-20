const http = require('http')

// 创建 web 服务器实例
const server = http.createServer()

// 为服务器实例绑定 request 事件，监听客户端请求
server.on('request', function(req, res) {
  const url = req.url
  const method = req.method
  const str = `请求的 url 是 ${url}，请求的方法是 ${method}`
  console.log(str)

  /* 实现简单路由 */
  // 设置默认相应内容为404
  let content = '<h1>404 Not found!</h1>'
  // 判断用户请求的url是 / 或 /index.html 首页；url是 /about.html 关于页面
  if (url === '/' || url === '/index.html') {
    content = '<h1>首页</h1>'
  } else if (url === '/about.html') {
    content = '<h1>关于</h1>'
  }

  // 设置响应头部，解决中文乱码问题
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // 向客户端响应内容
  res.end(content)
})

server.listen(8080, function () {
  console.log('server running at http://127.0.0.1:8080');
})