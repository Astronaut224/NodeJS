const path = require('path')
const fs = require('fs')

// path.join()里 ../ 会抵消前面的路径，./会被忽略
const pathStr = path.join('/a', '/b/c', '../../', './d', 'e')
console.log(pathStr); // \a\d\e

fs.readFile(path.join(__dirname, '../', './files/date.txt'), 'utf-8', function(err, data) {
  if (err) {
    console.log('failed!' + err.message);
  } else {
    console.log('content:' + data);
  }
})