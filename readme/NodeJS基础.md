# NodeJS基础

## 初识NodeJS

Node.js是一个基于Chrome V8引擎的JavaScript运行时环境。

## fs文件系统模块

- fs模块的操作分为 同步 和 异步。
  - 同步：阻塞程序的执行，除非操作完毕，否则不向下执行代码。
  - 异步：不会阻塞程序，在操作执行完成时，通过回调函数返回结果。
- 打开模式：

| 模式 | 说明                                     |
| ---- | ---------------------------------------- |
| r    | 读取文件，文件不存在抛出异常             |
| r+   | 读写文件，文件不存在抛出异常             |
| rs   | 同步模式下打开文件用于读取               |
| rs+  | 同步模式下打开文件用于读写               |
| w    | 写文件，不存在则创建，存在则覆盖原有内容 |
| wx   | 写文件，文件存在打开失败                 |
| w+   | 读写文件，不存在创建，存在截断           |
| wx+  | 读写，存在打开失败                       |
| a    | 追加，不存在创建                         |
| ax   | 追加，存在失败                           |
| a+   | 追加和读取，不存在创建                   |
| ax+  | 追加和读取，存在失败                     |

### 读取文件

**简单文件读取**

```javascript
fs.readFile(path[,options], callback)
```

- path：文件路径
- options：配置选项，若是字符串则指定编码格式
  - encoding：编码格式
  - flag：打开方式
- callback：回调函数
  - err：错误信息
  - data：读取的数据，如果未指定编码信息则返回一个Buffer

```javascript
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
```

**流式文件读取**

简单文件读取会一次性读取文件到内存中，如果文件较大会影响系统性能且读取速度慢。大文件适合流式文件读取，它会分多次将文件读取到内存中。

```javascript
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
```

### 写入文件

**简单文件写入**

```javascript
fs.write(path, data[, options], callback)
```

- path：文件路径
- data：写入内容
- options：配置选项，包含encoding，mode，flag；若是字符串则指定编码格式
- callback：回调函数

```javascript
const fs = require('fs')

fs.writeFile('../files/hello.txt', 'Hello NodeJS', { flag: 'w' }, function(err) {
  if (err) {
    console.log('failed!' + err);
  } else {
    console.log('success!');
  }
})
```

**流式文件写入**

同步、异步、简单文件写入都不适合大文件写入，容易造成内存溢出。

```javascript
const fs = require('fs')

// 创建可写流
var ws = fs.createWriteStream('../files/hello_stream.txt')

// 通过ws向文件中输出内容
ws.write('Hello NodeJS')
ws.write('1')

var rs = fs.createReadStream('../files/date.txt')
rs.pipe(ws)
```

### 路径动态拼接问题

- 问题：在使用fs模块操作文件时，如果路径是`./`或`../`这种相对路径，容易出现路径动态拼接错误问题。
- 原因：代码运行时，会根据 node 命令所处的目录，动态拼接出操作文件的完整路径。
- 解决方案：在使用fs模块时，直接提供完整路径。`__dirname`能获取当前js文件所在文件夹的绝对路径。

```javascript
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
```

### 其他操作

- 验证路径是否存在

`fs.exist(path, callback)`

`fs.existSync(path)`

- 获取文件信息

`fs.stat(path, callback)`

- 删除文件

`fs.unlink(path, callback)`

`fs.unlinkSync(path)`

- 列出文件

`fs.readdir(path[, options], callback)`

`fs.readdirSync(path[, options])`

- 截断文件

`fs.truncate(path, len, callback)`

`fs.truncate(path, len)`

- 创建目录

`fs.mkdir(path[, mode], callback)`

`fs.mkdirSync(path[, mode])`

- 删除目录

`fs.rmdir(path, callback)`

`fs.rmdirSync(path)`

- 重命名文件和目录

`fs.rename(oldpath, newpath, callback)`

`fs.renameSync(oldpath, newpath)`

- 监视文件更改

`fs.watchFile(filename[, options], listener)`

## path模块

path模块是Node.js官方提供的用于处理路径的模块。

**路径拼接**`path.join()`

```javascript
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
```

**获取路径中的文件名**`path.basename()`

使用`path.basename()`方法，可以获取路径中的最后一部分，常通过该方法获取路径中的文件名。

`path.basename(path[, ext])`

path：文件路径

ext：文件扩展名

```javascript
const path = require('path')

const filePath = 'C:\Users\mi\Desktop\NodeJS\files\\date.txt'

const name = path.basename(filePath)
console.log(name);	// date.txt

const nameWithoutExt = path.basename(filePath, '.txt')
console.log(nameWithoutExt);	//date
```

**获取路径中文件扩展名**`path.extname()`

```javascript
const path = require('path')

const filePath = 'C:\Users\mi\Desktop\NodeJS\files\\date.txt'

const name = path.extname(filePath)
console.log(name);	// .txt
```

## http模块

http模块是官方提供用于创建web服务器的模块。

**创建基本Web服务器**

```javascript
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
```

## 模块化

- 模块化是指解决一个复杂问题时，自顶向下逐层把系统划分为若干模块的过程，模块是可组合、分解和更换的单元。
- 模块化可提高代码的复用性和可维护性，实现按需加载。
- 模块化规范是对代码进行模块化拆分和组合时需要遵守的规则，如使用何种语法格式引用模块和向外暴露成员。

### 分类

- 内置模块
- 自定义模块
- 第三方模块

### 作用域

- 和函数作用域类似，在自定义模块中定义的变量、方法等成员，只能在当前模块内被访问，这种模块级别的访问限制，叫做模块作用域
- 防止全局变量污染

### 作用域成员

- 自定义模块中都有一个 `module` 对象，存储了和当前模块有关的信息
- 在自定义模块中，可以使用 `module.exports` 对象，将模块内的成员共享出去，供外界使用。导入自定义模块时，得到的就是 `module.exports` 指向的对象。
- 默认情况下，`exports` 和 `module.exports` 指向同一个对象。最终共享的结果，以 `module.exports` 指向的对象为准。

### 模块加载机制

模块在第一次加载后会被缓存，如果多次调用`require()`不会导致代码被执行多次，这样做提高了模块加载的效率。

**内置模块加载**

内置模块加载优先级最高。

**自定义模块加载**

加载自定义模块时，路径要以 `./` 或 `../` 开头，否则会作为内置模块或第三方模块加载。

导入自定义模块时，若省略文件扩展名，则 Node.js 会按顺序尝试加载文件：

- 按确切的文件名加载
- 补全 `.js` 扩展名加载
- 补全 `.json` 扩展名加载
- 补全 `.node` 扩展名加载
- 报错

**第三方模块加载**

- 若导入第三方模块， Node.js 会从**当前模块的父目录**开始，尝试从 `/node_modules` 文件夹中加载第三方模块。
- 如果没有找到对应的第三方模块，则移动到再**上一层父目录**中，进行加载，直到**文件系统的根目录**。

例如，假设在 `C:\Users\bruce\project\foo.js` 文件里调用了 `require('tools')`，则 Node.js 会按以下顺序查找：

- `C:\Users\bruce\project\node_modules\tools`
- `C:\Users\bruce\node_modules\tools`
- `C:\Users\node_modules\tools`
- `C:\node_modules\tools`

**目录作为模块加载**

当把目录作为模块标识符进行加载的时候，有三种加载方式：

- 在被加载的目录下查找 `package.json` 的文件，并寻找 `main` 属性，作为 `require()` 加载的入口
- 如果没有 `package.json` 文件，或者 `main` 入口不存在或无法解析，则 Node.js 将会试图加载目录下的 `index.js` 文件。
- 若失败则报错