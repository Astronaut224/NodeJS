const fs = require('fs')

fs.writeFile('../files/hello.txt', 'Hello NodeJS', { flag: 'w' }, function(err) {
  if (err) {
    console.log('failed!' + err);
  } else {
    console.log('success!');
  }
})