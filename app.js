const express = require("express");
const axios = require('axios');
const app = express();
const port = 3000;

app.set("view engine","ejs")
app.use(express.static(__dirname+'/public'))

var authors = new Array();
var titles = new Array();
var descriptions = new Array();
var urls = new Array();
var imgurls = new Array();
var sources = new Array(); 

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
    res.setHeader('Content-Type', 'application/json');
    res.render('home',{sources:sources,authors:authors,titles:titles,descriptions:descriptions,urls:urls,imgurls:imgurls})
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });   
});

app.get('*',function(req,res){
  res.render('error')
});

app.listen(port, () => console.log(`App listening on port ${port}!`));