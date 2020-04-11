var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    articles:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:  "Article"
    }]
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);