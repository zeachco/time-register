var express = require('express');
var serveStatic = require('serve-static');
var app = express();
var fs = require('fs');
var mime = require('mime-types');

app.use(function(req, ressource, next) {
  console.log(req.hostname, req.path);
  next();
});

app.use('/static', serveStatic('public'));
app.use('/libs', serveStatic('bower_components'));
app.set('view engine', 'jade');



app.get('/domain', function(req, res) {
  var file = './files/' + req.hostname + '.jpg';
  var mimetype = mime.lookup(file);
  console.log(file, mimetype);
  var fileContent = fs.readFile(file, function(err, data) {
    res.setHeader("Content-Type", mimetype);
    res.end(data);
  });
});

var shoot;

app.get('/shoot/:val', function(req, res) {
  shoot = req.params.val;
  res.json({
    ok: 200
  });
});

app.get('/jade/:file', function(req, res) {
  function retry() {
    if (shoot === 'true') {
      res.render(req.params.file, {
        title: 'Hey',
        message: 'Lorem ipsum!',
        path: req.path
      });
    } else {
      console.log('retrying...');
      setTimeout(retry, 500);
    }
  }
  retry();
});

app.listen(3005);
