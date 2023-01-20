const fs = require('fs')

fs.readFile('../files/date.txt', 'utf-8', function(err, data) {
  if (err) {
    return console.log('failed!' + err.message);
  }
  console.log('content:' + data);
})

// 复制文件内容
fs.readFile('../files/G.E.M.邓紫棋 - 光年之外.mp3',function(err, data) {
  if (!err) {
    console.log(data);
    // 将data写入到文件中
    fs.writeFile('C:/Users/mi/Desktop/NodeJS/files/hello.jpg', data, function(err) {
      if (!err) {
        console.log('文件写入成功');
      } else {
        console.log('文件写入失败,' + err.message);
      }
    })
  }
})
