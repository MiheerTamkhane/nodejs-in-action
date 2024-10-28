const http = require('http');
const fs = require('fs')
const server = http.createServer((req, res) => {
    const log = `${Date.now()}: User entered.\n`
    fs.appendFile('./logs.txt', log, (err, req) => {
        res.end('Hi from server.')
    })
})

server.listen(4000, () => console.log('server started'))