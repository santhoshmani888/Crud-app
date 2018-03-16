var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var app = express();
var mongoose   = require('mongoose');  
mongoose.connect('mongodb://localhost/test',{ useMongoClient: true , promiseLibrary: global.Promise});
var session = require('express-session');
var expressValidator = require('express-validator');
var path = require('path');
var db = mongoose.connection;
var Users = require('./models/users');
var Posts = require('./models/posts');
var router = require('./routes/router');
var flash = require('express-flash-messages');
// var router = express.Router();  

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({ secret: 'test' }));

var authunticate = function(req, res, next) {
  if (req.session && req.session.user === "san" )
    return next();
  else
    return res.sendStatus(401);
};
app.get('/submit', function (req, res) {
   if(req.query.username === "san") {
    req.session.user = "san";
    
    res.send("login success!");
  }
});

app.get('/', function(req, res) {
    res.render('home', { title: 'Cruders' });
});
//  app.get('/', router.home);
 
app.post('/register', function(req, res) {
  let users = new Users();
  users.username = req.body.username;
  users.email = req.body.email;
  users.bday = req.body.bday;
 username =users.username ;
 email = users.email ;
bday = users.bday ; 
req.app.locals.username =username; 
users.save();
res.render('profile', { title: 'Form Submitted', username : username , email : email , bday :bday  });
});

  
app.get('/register', function(req, res) {
  res.render('register');  
  });

app.post('/submit', function(req, res,next) {
  Users.find({username: req.body.username },(function(err, result) {
    if (err) throw err;
    req.app.locals.username =req.body.username;
    res.render('profile', { title: 'To Update', username : result[0].username , email : result[0].email , bday :result[0].bday  }); 
})) 
});

app.get('/EditProfile', function(req, res) {
 Users.find({username: req.app.locals.username },(function(err, result) {
    if (err) throw err;      
  res.render('edittedprofile', { title: 'To Update', username : result[0].username , email : result[0].email , bday :result[0].bday  }); 
}))
});

app.post('/Updated',function(req, res) {
  username: req.body.username
  email: req.body.email
  bday: req.body.bday 
    Users.update({
      query: { "username" : req.app.locals.username},
      update: { $set: { "email": req.body.email,"bday":req.body.bday } },
         new:true
   });
    
res.render('profile', { title: 'Updated',message: req.flash('Info updated succesfully'),username : req.body.username , email : req.body.email , bday :req.body.bday  });
});

//to delete a post
app.get('/delete/:id',function(req, res) {
  Posts.remove({"_id":req.params.id}, function(err, result) { 
      });
  Posts.find({},(function(err,posts){
      if(err) throw err;

      res.render('posts', {posts:posts});
      }));
});

//to view all the posts
app.get('/ViewPost',function(req, res) {
     if (typeof req.app.locals.username == 'undefined') res.redirect('/')
     else{
  Posts.find({},(function(err,posts){
      if(err) throw err;
      res.render('posts', {posts:posts});
  }));
     }
});

//to view a single post. Yet to implement delete post.
app.get('/post/:id',function(req, res) {
     if (typeof req.app.locals.username == 'undefined') res.redirect('/');
     else {
  Posts.find({_id:req.params.id},(function(err,myPost){
      if(err) throw err;
      var deleteStatus = false;
      if(myPost[0].username === req.app.locals.username){
          deleteStatus = true;
      }
      if((myPost[0].visibility=="all")|| deleteStatus==true){
          res.render('viewpost', { username: myPost[0].username, postContent:myPost[0].messages, id:myPost[0].id,deleteStatus:deleteStatus });
      }
      else{
          res.render('forbidden');
      }
  }));
}
});

//Create a Post
app.get('/CreatePost',function(req,res) {
      if (typeof req.app.locals.username == 'undefined') res.redirect('/');
     else
  res.render('createPost', { title:'Create a Post' });
});

//After Creating the post - redirect to view
app.post('/Created', function(req, res) {
          if (typeof req.app.locals.username == 'undefined') res.redirect('/');
  else{
  let p = new Posts();
  p.username = req.app.locals.username;
  p.messages = req.body.messages;
  p.visibility = req.body.visibility;
  p.save();
  Posts.find({},(function(err,posts){
      if(err) throw err;

      res.render('posts', {posts:posts});
  }));
}
});

//pregenerated code
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// startup our app at http://localhost:3000
//app.listen(3000);
module.exports = app;
