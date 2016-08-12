
const http = require('http')
const fs = require('fs')

const HOST = 'http://localhost:8000'

http.createServer(function(req, res) {
  console.log('Received request for', req.url)

  let url = req.url[0] === '/' ? req.url.slice(1) : req.url
  
  switch (req.url) {
    case '/':
    case '':
    case '/home':
      res.writeHead(301, {Location: HOST + '/index.html'});
      res.end();
  }

  let ext = req.url.split('.')[req.url.split('.').length - 1]
  console.log('ext:', ext)
  let fn = req.url.slice(1)
  let file
  try {
    let file = fs.readFileSync(req.url.slice(1))

    let type
    switch (ext) {
      case 'js':
        type = 'application/javascript'
        break
      case 'css':
        type = 'text/css'
        break
      case 'png':
        type = 'image/png'
        break
      case 'jpg':
        type = 'image/jpg'
        break
      case 'html':
        type = 'text/html'
        break
      case 'svg':
        type = 'image/svg+xml'
        break
      default:
        type = 'text/plain'
        break
    }
    res.writeHeader(200, {'Content-Type': type})
    res.end(file)

  } catch(err) {
    //console.log('err: ', err)
    pageNotFound(req, res)
  }
}).listen(8000)


function pageNotFound(req, res) {
  res.writeHeader(404, {'Content-Type': 'text/html'})
  res.end('ERR-404\nFile not found. Sorry \'bout it!')
}


