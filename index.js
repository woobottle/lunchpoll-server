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
// app.get('/', function (req, res) {
//   res.send('Hello home page');
// });

app.post("/", urlencodedParser, function(req, res) {
  res.status(200).end()
  var reqBody = req.body;
  var responseURL = reqBody.response_url;
  var first = reqBody.split(' ')[0]
  var second = reqBody.split(' ')[1]
  var third = reqBody.split(' ')[2]
  
  var message = {
    text: "This is your first interactive message",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*오늘 뭐먹지?* Poll by <fakeLink.toUser.com|WooBottle>"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            first
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Vote"
          },
          value: "click_me_123"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            emoji: true,
            text: "No votes"
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            second
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Vote"
          },
          value: "click_me_123"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            emoji: true,
            text: "No votes"
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            third
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Vote"
          },
          value: "click_me_123"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "No votes"
          }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Add a suggestion"
            },
            value: "click_me_123"
          }
        ]
      }
    ]
  };
  sendMessageToSlackResponseURL(responseURL, message);
});

app.post("/send-me-buttons", urlencodedParser, (req, res) => {
  res.status(200).end() // best practice to respond with empty 200 status code
  var reqBody = req.body
  var responseURL = reqBody.response_url
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

app.post("/actions", urlencodedParser, (req, res) => {
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