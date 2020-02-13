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
  console.log(reqBody);
  var responseURL = reqBody.response_url;
  var first = reqBody.text.split(' ')[0]
  var second = reqBody.text.split(' ')[1]
  var third = reqBody.text.split(' ')[2]
  
  var message = {
    response_type: "in_channel",
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
          text: first
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
          text: second
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Vote 3"
          }
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
          text: third
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
      }
    ]
  };
  sendMessageToSlackResponseURL(responseURL, message);
});


app.post("/actions", urlencodedParser, (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  var actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  console.log(actionJSONPayload);
  console.log(actionJSONPayload.message.blocks)
  actionJSONPayload.message.blocks[4].text.text = "123"

  var message = {
    response_type: "in_channel",
    replace_original: "true",
    text:
      actionJSONPayload.user.name +
      " clicked: " +
      actionJSONPayload.actions[0].name,
    replace_original: false
  };
  sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
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
    
  });
}
