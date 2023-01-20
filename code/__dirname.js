const fs = require('fs')

var url = ''
var arr = __dirname.split('\\')
arr.pop()
arr.forEach(item => {
  url += item + '/'
})

fs.readFile(url + 'files/date.txt', function(err, data) {
  if (err) {
    console.log('failed!' + err.message);
  } else {
    console.log('content:' + data);
  }
})

