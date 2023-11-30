var express = require('express');
var app = express.Router();

var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({secret: "Your secret key"}));


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/story');
var person = require('./model/person.js')
var art = require('./model/art.js')
var topic =require('./model/topic.js')

app.get('/', function(req, res){
   art.find({status:2},function(reqt, response){

    res.render('blog',{Articles:response});
 });  })

app.use(function(req, res, next) {   
   res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');  
    next(); 
   });


 app.get('/signup', function(req, res){
    res.render('signup', {
       message: ""});
 });

 app.get('/art', function(req, res){
   var q = req.query.id
   
   art.find({status:2},function(reqt, response){
      topic.find(function(req, resp){
         art.find({userid:q},function(requ, myArt) { 
        console.log(myArt)
         
  res.render('art',{article: response,items:resp ,myArticles:myArt } );
   }) })  }) })



app.post('/signup', function(req, res){
   var personInfo = req.body; //Get the parsed information

   if(!personInfo.name || !personInfo.email || !personInfo.password){
             // res.send("Sorry, you provided worng info")
               res.render("signup",{message:"Sorry, you provided worng info"});
      } 
   else{
         person.findOne({email:req.body.email,password:req.body.password,id:req.body._id},function(err,data){
            if(data){
                   res.render("signup",{message:"You have an account please login "});
             }
            else{
                 var newPerson = new person({
                 name: personInfo.name,
                 email: personInfo.email,
                 password: personInfo.password,
                 status:"1",
                 privilege:"user"
                });
                console.log(newPerson)
                 req.session.person= newPerson;
                 console.log(req.session.person.name)
                 newPerson.save(function(err, Person){
                       if(err)
                             res.send("database Error");
                       else
                            art.find(function(req, response){
                            //res.render('art',{article: response} );
                            res.redirect('/art')
                             });
                  });
              }
         })
      }  
})



/*login*/






app.post('/login', function(req, res){
   if(!req.body.email || !req.body.password){
         res.render("signup",{message:"Please enter your details"});
   }
   else {
      topic.findOne({email:req.body.email,password:req.body.password,id:req.body._id},function(err,item){
      if(item){
         req.session.topic = item
         res.redirect('/manager')
         // console.log(req.session.topic)
         // var q=item.topics
         // art.find({status:1,topic:q},function(req, resp){
         //    console.log(resp)
         // res.render('topicManager',{article:resp}) })
         }
      else{ 
      person.findOne({email:req.body.email,password:req.body.password,id:req.body._id},function(err,data){
         if(data){
            if(data.status===1 && data.privilege=="user" ){
                  req.session.person = data;
                  console.log( req.session.person)
                  art.find({status:2},function(req, response){
                     
                   res.redirect('/art?id='+data._id,)
                  });
             }else if(data.status===1 && data.privilege=="admin" ){
               res.redirect('/admin')
            }     
            else if(data.status===0){
            res.render("signup",{message:"Admin blocked this account"})
                   }
         }
         else{
            //res.render("/signup",{message:"there is no account existing ,create an account, signup"})
            res.render("signup",{message:"there is no account existing ,create an account, signup"})
         }
      })}
      }

    )} 
});


app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/');
});
/* my account*/

app.get('/myAccount', function(req, res){
    var p =req.session.person._id
    var q =  req.query.mess
   art.find({userid:p},function(ret, resp){

      res.render('myaccount',{myArticles:resp ,mess:q})
   })
});


// /*add articles*/
app.get('/add', function(req, res){
  topic.find(function(ret,resp){
     res.render('all',{items:resp} );
   })
})

/*Art delete user*/
app.get('/UserRemove/:id', function(req, res){
   var id = req.params.id;
   art.updateOne({_id:id},{status:0}, function(err, response){
      if(err) res.send({message: "Error in deleting record id " + req.params.id});
      else
      res.redirect('/myAccount?mess=Article Deleted')
   });
 });


/*user add article*/
 app.post('/add', function(req, res){
   var artInfo = req.body; 
   if(!artInfo.head || !artInfo.topic || !artInfo.content){
      res.send("Sorry, you provided worng info")
   } else {
      console.log(req.session.person)
   
        var newart = new art({
       user:  req.session.person.name,
       userid:   req.session.person._id,
        head: artInfo.head,
        topic: artInfo.topic,
        content: artInfo.content,
        status:"1"
        });
         console.log(newart)
      newart.save(function(err, Person){
      if(err)
        res.send("database Error");
       else
     
       res.redirect('/myAccount?mess= Article added')
     
      });
     }  
    })


     

   
  

module.exports = app;

