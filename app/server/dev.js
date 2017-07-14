const express = require('express')
const {createBundle, serveBundle} = require('./util')

const server = express()

// serve app bundle
const appBundle = createBundle(__dirname + '/../app')
serveBundle(server, '/app.js', appBundle)
server.use(express.static(__dirname+'/../app/static'))
server.use('/index.css', express.static(__dirname+'/../app/index.css'))
server.use('/css', express.static(__dirname+'/../app/css'))
// start the server
const port = '9009'
server.listen(port)
console.log(`Fathom listening on port ${port}`)
