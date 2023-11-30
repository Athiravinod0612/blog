var express = require('express');
var app = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/story');
var person = require('./model/person.js')
var art = require('./model/art.js');
const topic = require('./model/topic.js');

app.get('/admin', function(request, res){
   art.find(function(req, articles){

      topic.find(function(req, topic){
         var t= topic

   person.find({privilege:"user"},function(req, response){
      var q = request.query.message
    res.render('adminPage',{data: response, message:q,article: articles ,items:t}  );
    })  })  })
});

/*blocked user*/
app.get('/block/:id', function(req, res){
   var id = req.params.id
   
      person.findOneAndUpdate({_id:id},{status:0}, function(err, response){
         if(err)
           res.send(err)
        else{
        res.redirect('/admin?message=blocked user '+response.name)
        console.log(response)
        }
        })
   })

 /*delete user */
 app.get('/delete/:id', function(req, res){
   var id = req.params.id
    person.findOneAndRemove({_id:id}, function(err, response){
       if(err) res.send({message: "Error in deleting record id " + req.params.id});
       else
       res.redirect('/admin?message=Delete user '+response.name)
    });
 })
 
   /* unblocked user*/
   app.get('/unblock/:id', function(req, res){
      var id = req.params.id
      person.findOneAndUpdate({_id:id},{status:1}, function(err, response){
          if(err)
            res.send(err)
         else
         res.redirect('/admin?message=unblocked user '+response.name)
         })
      })

/* Add tipic managent*/
app.get('/addtopic', function(request, res){

     res.render('AddTopic' )
});
app.post('/addtopic', function(req, res){
   var personInfo = req.body; //Get the parsed information

   if(!personInfo.managerName || !personInfo.managerEmail || !personInfo.managerPassword){
               res.send("Sorry, you provided worng info")
      } 
   else{
         topic.findOne({email:req.body.managerEmail,password:req.body.managerPassword,id:req.body._id},function(err,data){
            if(data){
                   res.render("signup",{message:"You have an account please login "});
             }
            else{
                 var newtopic = new topic({
                 name: personInfo.managerName,
                 email: personInfo.managerEmail,
                 password: personInfo.managerPassword,
                 status:"1",
                 topics:personInfo.newTopic,
                 privilege:"manager"
                });
                console.log(newtopic)
                 req.session.person= newtopic;
                 newtopic.save(function(err, Person){
                       if(err)
                             res.send("database Error");
                       else
                            art.find(function(req, response){
                            //res.render('art',{article: response} );
                            res.redirect('/admin?message= topic manager added')
                             });
                  });
              }
         })
      }  
})
/*blocked manager*/
app.get('/blockManager/:id', function(req, res){
   var id = req.params.id
  
      topic.findOneAndUpdate({_id:id},{status:0}, function(err, response){
         if(err)
           res.send(err)
        else{
        res.redirect('/admin?message=blocked manager: '+response.name)
        }
        })
   })

 /*delete manager */
 app.get('/deletemanager/:id', function(req, res){
   var id = req.params.id
  
    topic.findByIdAndRemove({_id:id}, function(err, response){
       if(err) res.send({message: "Error in deleting record id " + req.params.id});
       else
       res.redirect('/admin?message=delete manager: '+response.name )
    });
 })
 
   /* unblocked manager*/
   app.get('/unblockmanager/:id', function(req, res){
      var id = req.params.id
      topic.findOneAndUpdate({_id:id},{status:1}, function(err, response){
          if(err)
            res.send(err)
         else
         res.redirect('/admin?message=unblocked manager: '+response.name )
         })
      })

 
 /*articles*/
 app.get('/adminart', function(request, res){
    art.find(function(req, response){
      
      res.render('story',{article: response} );
      //else
      //res.render('table',{data: response, message:''} );
    
   })
 });
//  /*delete art*/
 app.get('/adminRemove/:id', function(req, res){
  
    art.findByIdAndRemove(req.params.id, function(err, response){
       if(err) res.send({message: "Error in deleting record id " + req.params.id});
       else
       res.redirect('/articles')
    });
 });
//  /*approved art*/
//  app.get('/Approved/:id', function(req, res){
//    console.log(req.params.id)
//    var id = req.params.id;
//    art.updateOne({_id:id},{status:2}, function(err, response){
//        if(err)
//          res.send(err)
//       else
//        res.redirect('/adminart')

//       })

//    })
//    /*reject art*/

//    app.get('/reject/:id', function(req, res){
//       console.log(req.params.id)
//       var id = req.params.id;
//       art.updateOne({_id:id},{status:0}, function(err, response){
//           if(err)
//             res.send(err)
//          else
//           res.redirect('/adminart')
   
//          })
   
//       })
   

module.exports = app;