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