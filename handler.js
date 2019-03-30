'use strict';
var URL = require('./models.js');
var dns = require('dns');


function checkURL (req, res, next) {
  var url = req.body.url;
  // --:: PART I::--
  //check if the url is valid then procede else return error JSON
  
  //if url end with '/', have it removed
  if ( url.match(/\/$/))
      url = url.slice(0,-1);
  
  //return error json if protocol 'http(s)://' doesnot match
  var protocolMatch = url.match(/^https?:\/\/(.*)/);
  if(!protocolMatch)
    res.json({error: 'invalid URL'});
  
  //taking only the host and having a dns lookup
  var hostAndPath = protocolMatch[1];
  var hostMatch = hostAndPath.match(/^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i);
  //if its correct format then do a dns lookup else return error JSON
  if (hostMatch) {
    dns.lookup(hostMatch[0],(err) => err ? res.json({error: 'invalid URL'}) : next());
  }
  else {
    res.json({error: 'invalid URL'});
  }
}
  
function addingURL (req, res, next) {
  var url = req.body.url;
  // --::PART II::--
  //search if the url is already present
    //if present set response accordingly
    //else not present 
      //calculate short_url = max(counter)+1
        //save this data in db
          //set response with calculated counter
  URL.findOne({url: url}, function (err,data) {
    if (err) {
      console.log("db error in finding url!");
      next(err);
    }
    
    else if (data) {
      //url already exist
      res.json({original_url : data.url, short_url: data.counter});
    }
    
    else {
      //retrive next counter value to save in new document!
      var counter = 1;
      URL.find({}).sort({counter: -1}).limit(1).exec(function (err,maxCounter,) {   // find the maximum among present
        if (err) {
          console.log("db error in finding max counter!");
          next(err);
        }
        else if (maxCounter[0]) {
          counter = maxCounter[0].counter+1;
        }
        //save them in the database
        var newURL = new URL ({url: url, counter: counter});
        newURL.save((err,data) => {
          if (err) {
            console.log("Saving in db error!");
            next(err);
          }
          res.json({original_url : url, short_url: counter});
        });
      });  //end of find().exec()
    }
  });      //end of findOne()
}

function directingShortURL (req, res, next) {
  //search for the counter then return
  var counter = parseInt(req.params.short_url);
  
  if (counter == NaN || !counter) {
    res.json({error: 'invalid URL'});
  }
  
  URL.findOne({counter: counter}, (err,data) => {
    if (err) {
      console.log("db error in finding counter");
      next(err);
    }
    if (data) {
      res.redirect(data.url);
    }
    else {
      res.json({error: 'no such short_url'});
    }
  });
}

exports.handelPost = addingURL;
exports.handelGet = directingShortURL;
exports.checkURL = checkURL;