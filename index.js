var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var urlencode = require('urlencode');
const e = require('express');
const { restart } = require('pm2');
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
var restaurant_array = [["쿠시라쿠", urlencode("쿠시라쿠"), []], ["맥도날드", urlencode("신사 맥도날드"), []], ["브루클린버거", urlencode("브루클린버거"), []], 
                    ["두부공작소", urlencode("두부공작소"), []], ["소로길", urlencode("소로길"), []], ["동남아식당", urlencode("동남아식당"), []], 
                    ["무적의 돈까스", urlencode("무적의 돈까스"), []], ["장수 설렁탕", urlencode("장수 설렁탕"), []], ["우정식당", urlencode("우정식당"), []],
                    ["순두부와 삼겹살", urlencode("순두부와 삼겹살"), []]];
var naver_url_head = "nmap://search?query=";
var naver_url_tail = "&appname=naver-map-practice";

var restaurant_array_json_section = restaurant_array.map(function(v,i){
  return { 
            type: "section",
            text: {
              type: "mrkdwn",
              text: "[" + v[0] + "]" + "(" + naver_url_head + v[1] + naver_url_tail + ")"
            }, 
            accessory: { 
              type: "button", 
              text: { 
                type: "plain_text", 
                emoji: true, 
                text: "투표" 
              },
              value: i
            },
        }
});
  
var restaurant_array_json_context = restaurant_array.map(function (v, i) {
  return {
    type: "context", 
    elements: [{ 
      type: "plain_text",
      emoji: true,
      text: v[2].length
    }]
  };
});

// console.log(restaurant_array_json_context);

var combined_restaurant_array = [];

function combine(combined_restaurant_array){
  for (let i = 0; ; i++) {
    if(i/2 < restaurant_array_json_context.length){
      let index = Math.floor(i/2);
      if (i % 2 == 0) {
        combined_restaurant_array[i] = restaurant_array_json_section[index];
      } else {
        combined_restaurant_array[i] = restaurant_array_json_context[index];
      }
    }else{
      break;
    }
  }; 
}

combine(combined_restaurant_array);

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
    ...combined_restaurant_array,
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
      }
      ]
    }
  ]
};

console.log(message);

app.post("/", urlencodedParser, function(req, res) {
  res.status(200).end()
  var reqBody = req.body;
  console.log(reqBody);
  var responseURL = reqBody.response_url;
  
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
      ...combined_restaurant_array,
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
          }
        ]
      }
    ]
  };
  debugger;
  sendMessageToSlackResponseURL(responseURL, message);
});


app.post("/actions", urlencodedParser, (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  var pay_load = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  var value = pay_load.actions[0]['value'];
  if (value == "Delete") {
    deletePoll(pay_load);
  }
  else if(value == "Add"){
    var message = {
      text: "준비중인 기능입니다."
    }
    //sendMessageToSlackResponseURL(pay_load.response_url, message)
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
    console.log("error : " + error);
    console.log("----------");
    console.log("response : " + response);
    console.log("----------");
    console.log("body : " + body);
    console.log("----------");
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
  update_array(e.user['username'], e.actions[0]['value'])
  var messages = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*오늘 뭐먹지?* Poll by <fakeLink.toUser.com|WooBottle>",
      },
    },
    {
      type: "divider",
    },
    ...combined_restaurant_array,
    {
      type: "divider",
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "항목추가하기(예정)",
          },
          style: "primary",
          value: "Add",
        },
      ],
    },
  ];
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

function update_array(value, el){
  let valueIndex = restaurant_array[el][2].indexOf(value);
  if(valueIndex == -1){
    restaurant_array[el][2].push(value);
  }else{
    restaurant_array[el][2].splice(valueIndex, 1);
  }
  restaurant_array[el][2] = filter_array(restaurant_array[el][2]);
}

function filter_array(array){
  console.log(array)
  filtered_array = Array.from(new Set(array))
  console.log(filtered_array)
  return filtered_array
}
