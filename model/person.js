const { strict } = require('assert');
var mongoose = require('mongoose');

var personSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    status:Number,
    privilege:String
 });
 var person = mongoose.model("Person", personSchema);

 module.exports = person;
 