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

first_people = [];
second_people = [];
third_people = [];


//사용자가 get 방식으로 접속한걸 잡기 위해서
// app.get('/', function (req, res) {
//   res.send('Hello home page');
// });

app.post("/", urlencodedParser, function(req, res) {
  res.status(200).end()
  var reqBody = req.body;
  console.log(reqBody);
  first_people = [];
  second_people = [];
  third_people = [];
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
          value: "vote_for_one"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            emoji: true,
            text: first_people.length + " votes"
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
          },
          value: "vote_for_two"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            emoji: true,
            text: second_people.length + " votes"
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
          value: "vote_for_three"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: third_people.length + " votes"
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
              text: "항목추가하기"
            },
            style: "primary",
            value: "Add"
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Delete"
            },
            style: "danger",
            value: "Delete"
          }
        ]
      }
    ]
  };
  sendMessageToSlackResponseURL(responseURL, message);
});


app.post("/actions", urlencodedParser, (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  var actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  console.log(actionJSONPayload);
  console.log(actionJSONPayload.actions[0])
  console.log(actionJSONPayload.actions[1])
  console.log(actionJSONPayload.actions[0]["value"])
  console.log(actionJSONPayload.actions[0].value)
  if(actionJSONPayload.actions[0].value == "Delete"){
    deletePoll(actionJSONPayload);
  }
  // var message = {
  //   request_url: "https://hooks.slack.com/actions/T03EB3HS3/938267588882/RCeTzXvD3dWupG08EUcel1z0",
  //   response_type: "in_channel",
  //   replace_original: true,
  //   text:
  //     actionJSONPayload.user.name +
  //     " clicked: " +
  //     actionJSONPayload.actions[0].name,
  //   replace_original: false
  // };
  // sendMessageToSlackResponseURL(actionJSONPayload.response_url, message);
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

function deletePoll(e){
  var payload = e;
  console.log(payload)
  response_url = "https://slack.com/api/chat.delete";
   var options = {
     uri: response_url,
     method: 'POST',
     headers: {
       "Content-type": "application/json"
     },
     json: {
       channel: payload.container.channel_id,
       ts: payload.container.message_ts
     }
   };

   request(options, (error, response, body) => {
    console.log(error);
   });
}