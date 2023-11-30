var mongoose = require('mongoose');

var artSchema = mongoose.Schema({
    user: String,
    userid: String,
    topic: String,
    head: String,
    content: String,
    status:Number
 });
 var art = mongoose.model("art", artSchema);

 module.exports = art;