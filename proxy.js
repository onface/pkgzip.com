var express = require('express')
var app = express()
var proxy = require('express-http-proxy');

app.use(proxy('localhost:3000'))

app.listen(2000)
