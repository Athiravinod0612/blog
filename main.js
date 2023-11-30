var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var blog = require('./blog.js')
var admin = require('./admin.js')
var manager = require('./manager.js')





app.set('view engine', 'ejs')

app.use(express.static('image'));


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({secret: "Your secret key"}));
app.use('/', blog)
app.use('/', admin)
app.use('/', manager)




app.listen(8080, function (req, res) {
    console.log('server started');
});
