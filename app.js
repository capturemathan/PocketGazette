// Require Imports
const express       = require("express"),
      axios         = require('axios'),
      mongoose      = require('mongoose'),
      bodyParser    = require('body-parser'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      session       = require('express-session');

// Include MongoDB models
const Article = require('./models/article');
const User    = require('./models/user');
      
// Additional Setup
const app  = express();
const port = 3000;
app.set("view engine","ejs")
app.use(express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect("mongodb://localhost/newsapp", { useNewUrlParser: true, useUnifiedTopology: true})

// Express Session Setup
app.use(session({
  secret: 'Webapp by Mathan',
  resave: false,
  saveUninitialized: false,
}));

// Passing Current User Variable
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Variable Declarations
var authors = new Array();
var titles = new Array();
var descriptions = new Array();
var urls = new Array();
var imgurls = new Array();
var sources = new Array(); 

// Route Configurations

app.get('/news',function(req,res){
  console.log(req.user)
  axios.get('https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=c60dc7c66a474c03ba181227554788ee')
  .then(function (response) {
    var articles = response["data"]["articles"];
    for(var i=0;i<10;i++)
    {
        sources.push(articles[i]["source"]["name"])
        authors.push(articles[i]["author"])
        titles.push(articles[i]["title"])
        descriptions.push(articles[i]["description"])
        urls.push(articles[i]["url"])
        imgurls.push(articles[i]["urlToImage"])
    }
    res.setHeader('Content-Type', 'text/html');
    res.render('home',{sources:sources,authors:authors,titles:titles,descriptions:descriptions,urls:urls,imgurls:imgurls,currentUser:req.user})
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });   
})

app.get('/',function(req,res){
  res.redirect('/news')
});

app.get('/register',function(req,res){
  res.render('register')
});

app.post('/register',function(req,res){
  var newUser = new User({username: req.body.username})
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err)
      return res.render('register')
    }
    passport.authenticate("local")(req,res,function(){
      res.setHeader('Content-Type', 'text/html');
      res.redirect('/news');
    });
  });
});

app.get('/login',function(req,res){
  res.render('login')
});

app.post('/login',passport.authenticate("local",{
  successRedirect:'/news',
  failureRedirect:'/login'
}),function(req,res){

})

app.get('/bookmarks/:username',isLoggedIn,function(req,res){
  User.findOne({username: req.params.username}).populate('articles').exec(function(err,foundBookmarks){
    if(err){console.log(err)}
    else{
      console.log(foundBookmarks)
      res.render('bookmarks',{bookmarks:foundBookmarks});
    }
  });
});

app.post('/bookmarks/:username',isLoggedIn,function(req,res){
  User.findOne({username: req.params.username},function(err,user){
    if(err){console.log(err)}
    else{
      Article.create({
        imgurl:      req.body.imgurl,
        source:      req.body.source,
        title:       req.body.title,
        description: req.body.description,
        url:         req.body.url
      },function(err,article){
          if(err){console.log(err)}
          else{
            user.articles.push(article)
            user.save()
            console.log("Bookmarked article successfully")
          }
    })
  }
});
});

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/news')
})

// Middleware for checking Logged In Users
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.get('*',function(req,res){
  res.render('error')
});

app.listen(port, () => console.log(`App listening on port ${port}!`));