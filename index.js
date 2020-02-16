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
    blocks: [{
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
        elements: [{
          type: "plain_text",
          emoji: true,
          text: first_people.length + " votes"
        }]
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
        elements: [{
          type: "plain_text",
          emoji: true,
          text: second_people.length + " votes"
        }]
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
        elements: [{
          type: "mrkdwn",
          text: third_people.length + " votes"
        }]
      },
      {
        type: "divider"
      },
      {
        type: "actions",
        elements: [{
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
  var pay_load = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  console.log(pay_load);
  console.log(pay_load.actions[0]['value'])
  var value = pay_load.actions[0]['value'];
  if (value == "Delete") {
    deletePoll(pay_load);
  }
  else if(value == "Add"){
    var message = {
      text: "준비중인 기능입니다."
    }
    sendMessageToSlackResponseURL(pay_load.response_url, message)
  }
  else{
    update_message(pay_load)
  }
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
  response_url = e.response_url;
  var options = {
    uri: response_url,
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    json: {
      delete_original: "true"
    }
  };
  request(options, (error, response, body) => {
    console.log(body);
  });
}

function update_message(e){
  response_url = e.response_url;
  var messages = [
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
        text: "31232"
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
      elements: [{
        type: "plain_text",
        emoji: true,
        text: first_people.length + " votes"
      }]
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "31232"
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
      elements: [{
        type: "plain_text",
        emoji: true,
        text: second_people.length + " votes"
      }]
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "31232"
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
      elements: [{
        type: "mrkdwn",
        text: third_people.length + " votes"
      }]
    },
    {
      type: "divider"
    },
    {
      type: "actions",
      elements: [{
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "항목추가하기"
          },
          style: "primary",
          value: "12314242"
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
  var options = {
    uri: response_url,
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    json: {
      replace_original: 'true',
      token: e.token,
      channel: e.channel['id'],
      text: "hello",
      ts: e.message['ts'],
      blocks: messages
    }
  };
  request(options, (error, response, body) => {
    console.log(body);
  });
}

