var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false})
app.unsubscribe(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));

//사용자가 get 방식으로 접속한걸 잡기 위해서
app.get('/', function (req, res) {
  res.send('Hello home page');
});

// app.post("/", function(req, res, next) {
//   console.log(req.body)
//   res.json(req.body)
//   // res.send(req.body);
// });

app.post("/slack/slash-commands/send-me-buttons", urlencodedParser, (req, res) => {
res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
    var responseURL = reqBody.response_url
    if (reqBody.token != YOUR_APP_VERIFICATION_TOKEN){
        res.status(403).end("Access forbidden")
    }else{
        var message = {
            "text": "This is your first interactive message",
            "attachments": [
                {
                    "text": "Building buttons is easy right?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "yes",
                            "text": "yes",
                            "type": "button",
                            "value": "yes"
                        },
                        {
                            "name": "no",
                            "text": "no",
                            "type": "button",
                            "value": "no"
                        },
                        {
                            "name": "maybe",
                            "text": "maybe",
                            "type": "button",
                            "value": "maybe",
                            "style": "danger"
                        }
                    ]
                }
            ]
        }
        sendMessageToSlackResponseURL(responseURL, message)
    }
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

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
  var postOptions = {
    uri: responseURL,
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    json: JSONmessage
  };
  request(postOptions, (error, response, body) => {
    if (error) {
      // handle errors as you see fit
    }
  });
}

app.post("/slack/actions", urlencodedParser, (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  var actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  var message = {
    text:
      actionJSONPayload.user.name +
      " clicked: " +
      actionJSONPayload.actions[0].name,
    replace_original: false
  };
  sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
});