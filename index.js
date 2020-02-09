var express = require('express');
var app = express();
app.unsubscribe(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));

//사용자가 get 방식으로 접속한걸 잡기 위해서
// app.get('/', function (req, res) {
//   res.send('Hello home page');
// });

app.post("/", function(req, res, next) {
  console.log(req.body)
  res.json(req.body)
  res.send(req.body);
});


app.get('/form', function (req, res) {
  res.render('form');
})

app.post('/form_receiver', function(req, res, next){
  console.log(req.body)
  res.json(req.body)
  // var title = req.query.title;
  // var description = req.query.description;
  // res.send(title + ',' + description)
});

app.get('/topic', function (req, res) {
  res.send(req.query.id);
})

app.post("/actions", function (req, res) {
  // res.status(200).end(); 
  // res.json({ok: true});
  res.send('actions')
  console.log("afdfasdfds");
});

app.listen(3000, function() {
  console.log("Connected 3000 port!");
});