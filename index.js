'use strict';

var http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const request = require('request');

const restService = express();

const dateFormat = require('dateformat');

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

var slack_message;
restService.post('/upiPayement', function(req, res) {
	console.log("amount : " + req.body.result.parameters.amount);
	console.log("phone number : " + req.body.result.parameters.phonenumber);
	console.log("phone number length : " + req.body.result.parameters.phonenumber.toString().length);
	if(!(req.body.result && req.body.result.parameters && req.body.result.parameters.amount && req.body.result.parameters.amount > 0)){
		
		 var finalJson = {
							speech: "Seems like some problem in amount. Speak again.",
							displayText: "Seems like some problem in amount. Speak again.",
							source: 'webhook-echo-sample',
		                 }
				  return res.json(finalJson);
	}
	
	if(!(req.body.result && req.body.result.parameters && req.body.result.parameters.phonenumber && req.body.result.parameters.phonenumber.toString().length == 10)){
		
		 var finalJson = {
							speech: "Seems like some problem in phone number. Speak again.",
							displayText: "Seems like some problem in phone number. Speak again.",
							source: 'webhook-echo-sample',
		                 }
				  return res.json(finalJson);
	}
	
    var speech = req.body.result.parameters.echoText
	
	var amount =  req.body.result.parameters.amount
	var phonenumber = req.body.result.parameters.phonenumber
	
	console.log("Data from google home : "+speech+", "+amount+", "+phonenumber);

	var merchantTranId = + new Date();
	console.log("merchantTranId : "+merchantTranId );
	
	var payload = {
					   payerVa:phonenumber,
					   amount:amount,
					   note:"collect-pay-request",
					   collectByDate:dateFormat(new Date(), "dd/mm/yyyy hh:mm TT"),//"27/06/2017 12:30 PM",
					   merchantId:"131137",
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
