'use strict';

var http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const request = require('request');

const restService = express();

var dateFormat = require('dateformat');

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

var slack_message;
restService.post('/echo', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
	
	var amount = req.body.result && req.body.result.parameters && req.body.result.parameters.amount ? req.body.result.parameters.amount : "1"
	var phonenumber = req.body.result && req.body.result.parameters && req.body.result.parameters.phonenumber ? req.body.result.parameters.phonenumber : "9999999999"
	
	console.log("Data from google home : "+speech+", "+amount+", "+phonenumber);

	var merchantTranId = + new Date();
	console.log("merchantTranId : "+merchantTranId );
	
	var payload = {
					   payerVa:phonenumber,
					   amount:amount,
					   note:"collect-pay-request",
					   collectByDate:dateFormat(new Date(), "dd/mm/yyyy hh:mm TT"),//"27/06/2017 12:30 PM",
					   merchantId:"109404",
					   merchantName:"Testmerchant",
					   subMerchantId:"12234",
					   subMerchantName:"Test",
					   terminalId:"5411",
					   merchantTranId:""+merchantTranId,
					   billNumber:"54394", 
					   languageCode:"en"	
				   }
	
	var instaheaders = {
					deviceMac:'355470062139254',
					trnTimestamp:'04/07/2017 15:00:00',
					hash:'cRE2Xj7axtTtRIgnOiQCXptEJMhjZ0JXSb4P6N7Hb9Y=',
					JSESSIONID:'EB31FD22BE07EBB3536DA2A4E834B958'
	}
		
		request({
		  url: 'http://35.154.169.88:8080/fingpay/collectPayServiceGH',
		  method: 'POST',
		  json: payload,
		  headers : instaheaders
		}, function(error, response, body){
			if (!error && response.statusCode == 200) {
				  console.log(body);
				    var finalJson = {
							speech: body.message,
							displayText: body.message,
							source: 'webhook-echo-sample',
		                 }
				  res.send(finalJson);
				  
			} else {
				// error
				console.log("ERROR : "+error);
				res.send(error);
			}
      });

	
	
	// http://localhost:8080
	/*request.post('http://localhost:8080/fingpay/collectPayServiceGH', {form: payload,  headers: instaheaders}, function(error, response, body) {
		console.log( response.statusCode);
        if (!error && response.statusCode == 200) {
            // do something
			console.log(body);
			slack_message = JSON.parse(body);
			return res.json({
				speech: slack_message.message,
				displayText: speech,
				source: 'webhook-echo-sample',
		});
        } else {
            // error
			console.log(error);
        }
    });*/
    
   /* var options = {
     host: 'localhost',
     port: 8080,
     path: '/fingpay/collectPayServiceGH',
	 method: 'POST'
   };

	/*http.get(options, function(resp){
	  resp.on('data', function(chunk){
		//do something with chunk
		  console.log(speech);
		  slack_message = JSON.parse(chunk);
		  console.log(slack_message.message);
		  slack_message = slack_message.message;
		  console.log(slack_message);
		});
	}).on("error", function(e){
	  console.log("Got error: " + e.message);
	});
	
	const req1 = http.request(options, (res1) => {
    console.log(`STATUS: ${res1.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res1.headers)}`);
    res1.setEncoding('utf8');
	res1.setHeader('deviceMac', '355470062139254');
	res1.setHeader('trnTimestamp','04/07/2017 15:00:00');
	res1.setHeader('hash','cRE2Xj7axtTtRIgnOiQCXptEJMhjZ0JXSb4P6N7Hb9Y=');
	res1.setHeader();
    res1.on('data', (chunk) => {
     console.log(`BODY: ${chunk}`);
	 console.log("BODY : "+JSON.stringify(chunk));
    });
   res1.on('end', () => {
    console.log('No more data in response.');
   });
  });

  req1.on('error', (e) => {
   console.error(`problem with request: ${e.message}`);
  });

// write data to request body
req1.write(speech);
req1.end();*/
	 /*console.log("At Last : "+slack_message);
		return res.json({
			speech: slack_message,
			displayText: speech,
			source: 'webhook-echo-sample',
		});*/
});

restService.post('/slack-test', function(req, res) {

    var slack_message = {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.google.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.google.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'webhook-echo-sample',
        data: {
            "slack": slack_message
        }
    });
});




restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
