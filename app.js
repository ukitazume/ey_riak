require('js-yaml');

var express = require('express');
var app = express();
var nodeEnv = process.env.NODE_ENV || 'development'
var port = process.env.PORT || '3000'

try {
  var doc = require('./config/ripple.yml')[nodeEnv]
  var config = {host: doc.host, port: doc.http_port}
} catch(e) {
  console.log('nothing riak config at ./config/ripple.yml');
  exit();
}

var riakDB = require('riak-js').getClient(config);


app.get('/:key', function(req, res){
  riakDB.get('params', req.params.key, function(e, f, m){
    body = JSON.stringify(f);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
  });
})

app.get('/:key/:value', function(req, res){
  riakDB.save('params', req.params.key, req.params.value);
  body = 'ok'
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
})
app.listen(port);
