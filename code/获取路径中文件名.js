const path = require('path')

const filePath = 'C:\Users\mi\Desktop\NodeJS\files\\date.txt'

const name = path.basename(filePath)
console.log(name);

const nameWithoutExt = path.basename(filePath, '.txt')
console.log(nameWithoutExt);