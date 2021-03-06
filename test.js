var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})
app.unsubscribe(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));

first_people = [];
second_people = [];
third_people = [];
first = "";
second = "";
third = "";

//사용자가 get 방식으로 접속한걸 잡기 위해서
// app.get('/', function (req, res) {
//   res.send('Hello home page');
// });

app.post("/", urlencodedParser, function (req, res) {
  res.status(200).end()
  var reqBody = req.body;
  console.log(reqBody);
  first_people = [];
  second_people = [];
  third_people = [];
  var responseURL = reqBody.response_url;
  first = reqBody.text.split(' ')[0]
  second = reqBody.text.split(' ')[1]
  third = reqBody.text.split(' ')[2]

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
            text: "Vote"
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
            text: "항목추가하기(예정)"
          },
          style: "primary",
          value: "Add"
        }]
      }
    ]
  };

  sendMessageToSlackResponseURL(responseURL, message);
});

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
          text: "Vote"
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
          text: "항목추가하기(예정)"
        },
        style: "primary",
        value: "Add"
      }]
    }
  ]
};

console.log(message);
console.log(message.blocks);


app.post("/actions", urlencodedParser, (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  var pay_load = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  console.log(pay_load);
  console.log(pay_load.actions[0]['value'])
  var value = pay_load.actions[0]['value'];
  if (value == "Delete") {
    deletePoll(pay_load);
  } else if (value == "Add") {
    var message = {
      text: "준비중인 기능입니다."
    }
    //sendMessageToSlackResponseURL(pay_load.response_url, message)
  } else {
    update_message(pay_load)
  }
});

app.listen(3000, function () {
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

function deletePoll(e) {
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

function update_message(e) {
  response_url = e.response_url;
  update_array(e.user['username'], e.actions[0]['value'])
  console.log(first_people)
  console.log(second_people)
  console.log(third_people)
  var messages = [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*오늘 뭐먹지?* Poll by <fakeLink.toUser.com|WooBottle>"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": first
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "emoji": true,
          "text": "Vote"
        },
        "value": "vote_for_one"
      }
    },
    {
      "type": "context",
      "elements": [{
        "type": "plain_text",
        "emoji": true,
        "text": first_people.length + " votes"
      }]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": second
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "emoji": true,
          "text": "Vote"
        },
        "value": "vote_for_two"
      }
    },
    {
      "type": "context",
      "elements": [{
        "type": "plain_text",
        "emoji": true,
        "text": second_people.length + " votes"
      }]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": third
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "emoji": true,
          "text": "Vote"
        },
        "value": "vote_for_three"
      }
    },
    {
      "type": "context",
      "elements": [{
        "type": "mrkdwn",
        "text": third_people.length + " votes"
      }]
    },
    {
      "type": "divider"
    },
    {
      "type": "actions",
      "elements": [{
        "type": "button",
        "text": {
          "type": "plain_text",
          "emoji": true,
          "text": "항목추가하기(예정)"
        },
        "style": "primary",
        "value": "Add"
      }]
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
      text: "hello",
      blocks: messages
    }
  };
  request(options, (error, response, body) => {
    console.log(body);
  });
}

function update_array(value, el) {
  if (el == 'vote_for_one') {
    console.log(el);
    console.log("----------");
    console.log(value)
    first_people.push(value);
    console.log(first_people)
    first_people = filter_array(first_people);
  } else if (el == 'vote_for_two') {
    second_people.push(value);
    second_people = filter_array(second_people);
  } else {
    third_people.push(value);
    third_people = filter_array(third_people);
  }
}

function filter_array(array) {
  console.log(array)
  filtered_array = Array.from(new Set(array))
  console.log(filtered_array)
  return filtered_array
}