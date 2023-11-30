const { strict } = require('assert');
var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({
    topics: String,
    name:String,
    email: String,
    password: String,
    status:Number,
    privilege:String
 });
 var topic = mongoose.model("topic" ,topicSchema);

 module.exports = topic;