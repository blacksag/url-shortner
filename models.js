'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  url : {type: String, requred: true},
  counter : {type: Number, required: true}
});

module.exports = mongoose.model('URL',urlSchema);