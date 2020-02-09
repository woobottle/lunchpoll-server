var express = require('express');
var app = express();

app.use(express.static('public'));
//사용자가 get 방식으로 접속한걸 잡기 위해서
app.get('/', function (req, res) {
  res.send('Hello home page');
});

app.get('/login', function (req, res) {
  res.send('Login Please');
})

app.get('/topic', function (req, res) {
  res.send(req.query.id);
})

app.listen(3000, function () {
  console.log('Connected 3000 port!');
});

