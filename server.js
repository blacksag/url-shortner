'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var handler = require('./handler.js');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI,{useNewUrlParser: true});

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': false}));


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


//the post handler
app.post("/api/shorturl/new",handler.checkURL,handler.handelPost);

//the get handler
app.get("/api/shorturl/:short_url",handler.handelGet);

//Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
          .type('txt')
          .send(err.message || 'SERVER ERROR');
});

//404: Not found error middleware!
app.use(function(req, res){
  res.status(404);
  //res.render('404', { url: req.url });
  //res.send({ error: 'Not found' });
  res.type('txt').send('Not Found!');
});


app.listen(port, function () {
  console.log('Node.js listening ...\non port:'+port);
});