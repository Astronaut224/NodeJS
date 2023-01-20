const fs = require('fs')

// 创建一个可读流
var rs = fs.createReadStream('../files/G.E.M.邓紫棋 - 光年之外.mp3')
// 创建一个可写流
var ws = fs.createWriteStream('../files/a.mp3')

// 要读取可读流中的数据，要为可读流绑定一个data事件，data事件绑定完毕自动开始读取数据
rs.on('data', function(data) {
  console.log(data);
  // 将读取到的数据写入可写流中
  ws.write(data)
})

// 简便写法
var ws2 = fs.createWriteStream('../files/b.mp3')
// pipe()方法可以将可读流中的数据直接输出到可写流中
rs.pipe(ws2)