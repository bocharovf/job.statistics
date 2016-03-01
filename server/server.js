'use strict';

/**
  * @class Server
  * @memberOf hhStat
  * @description Application backend
  */

var settings = require('./settings.json');
var model = require('./model');
var cors = require('./cors');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors);

app.get('/dictionary/suggestions', function(req, res) {
  model.getSuggestions(function (err, suggestions) {
    if (err) res.json(500, err);
    else res.json(suggestions);
  });
});

app.get('/dictionary/cloudTags', function(req, res) {
  model.getCloudTags(function (err, cloudTags) {
  	if (err) res.json(500, err);
  	else res.json(cloudTags);
  });  
});

app.post('/common/log', function(req, res) {
	if (!req.body) res.sendStatus(500, "Incorrect request"); 
	
  model.addLog(req.body, function (err, docs) {
    if (err) res.json(500, err);
    else res.sendStatus(200);
  });
	
});

app.post('/common/queries', function(req, res) {
  if (!req.body) res.sendStatus(500, "Incorrect request"); 
  
  model.logQuery(req.body, function (err, docs) {
    if (err) res.json(500, err);
    else res.sendStatus(200);
  });
  
});

var server = app.listen(settings.portListen);

// let grunt-express-server task know that server has started
console.log('Server started'); 

module.exports = server;