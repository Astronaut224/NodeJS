const fs = require('fs')

// 创建可写流
var ws = fs.createWriteStream('../files/hello_stream.txt')

// 通过ws向文件中输出内容
ws.write('Hello NodeJS')
ws.write('1')

var rs = fs.createReadStream('../files/date.txt')
rs.pipe(ws)