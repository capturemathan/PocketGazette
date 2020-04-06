// Require Imports
const express       = require("express"),
      axios         = require('axios'),
      mongoose      = require('mongoose'),
      bodyParser    = require('body-parser'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      session       = require('express-session');

// Include MongoDB models
const User = require('./models/user');
      
// Additional Setup
const app  = express();
const port = 3000;
app.set("view engine","ejs")
app.use(express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect("mongodb://localhost/newsapp")

// Express Session Setup
app.use(session({
  secret: 'Webapp by Mathan',
  resave: false,
  saveUninitialized: false,
}));

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
app.get('/',function(req,res){
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
    res.render('home',{sources:sources,authors:authors,titles:titles,descriptions:descriptions,urls:urls,imgurls:imgurls})
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });   
});

app.get('/register',function(req,res){
  res.render('register')
});

app.get('*',function(req,res){
  res.render('error')
});

app.listen(port, () => console.log(`App listening on port ${port}!`));