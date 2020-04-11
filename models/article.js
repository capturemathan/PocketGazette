var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    imgurl:      String,
    source:      String,
    title:       String,
    description: String,
    url:         String
});

module.exports=mongoose.model("Article",articleSchema);