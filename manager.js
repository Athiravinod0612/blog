const express= require('express')
const session =require('express-session')
const app = express();

var person = require('./model/person.js')
var art = require('./model/art.js')
var topic =require('./model/topic.js')


app.get("/articles" ,(req,res) => {
   art.find( function(err, response){
  res.render("articles",{article:response})
  })
})  

app.get('/manager', function(request, resp){
   if(request.session.topic){
     var q= request.session.topic.topics
     
      art.find({topic:q,status:1},function(req,send){
         art.find({topic:q,status:0},function(req,reject){
            art.find({topic:q,status:2},function(req,approved){
         var p = request.query.mess
         resp.render('topicManager',{articlesend:send, articleReject:reject ,articleApproved:approved ,mess:p })

      }) }) }) 
    }
 
});


/*delete art*/
app.get('/removeart/:id', function(req, res){
  
  art.findByIdAndRemove(req.params.id, function(err, response){
     if(err) res.send({message: "Error in deleting record id " + req.params.id});
     else
     res.redirect("/manager?mess=Article Deleted ")
  });
});
/*approved art*/
app.get('/Approvedart/:id', function(req, res){
 var id = req.params.id;
 art.updateOne({_id:id},{status:2}, function(err, response){
     if(err)
       res.send(err)
    else
   // res.render("topicManager")
      res.redirect("/manager?mess=Article Approved")
    })

 })
 /*reject art*/

 app.get('/rejectart/:id', function(req, res){
    var id = req.params.id;
    art.updateOne({_id:id},{status:0}, function(err, response){
        if(err)
          res.send(err)
       else
       //res.render("topicManager")
       res.redirect("/manager?mess= Article Rejected")
       })
 
    })
 

module.exports = app;
