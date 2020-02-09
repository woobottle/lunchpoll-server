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
  res.json(`{
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Danny Torrence left the following review for your property:"
			}
		},
		{
			"type": "section",
			"block_id": "section567",
			"text": {
				"type": "mrkdwn",
				"text": "<https://example.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s."
			},
			"accessory": {
				"type": "image",
				"image_url": "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
				"alt_text": "Haunted hotel image"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "You can add a button alongside text in your message. "
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Button",
					"emoji": true
				},
				"value": "click_me_123"
			}
		}
	]
}`);
  // res.send(req.body);
});


app.get('/form', function (req, res) {
  res.render('form');
})

app.post('/form_receiver', function(req, res, next){
  console.log(req.body);
  res.json(req.body);
  // res.send(req.body);
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