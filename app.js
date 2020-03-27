const express = require("express");
const app = express();
const port = 3000;

app.set("view engine","ejs")
app.use(express.static(__dirname+'/public'))

app.get('/',function(req,res){
    res.render('home')
});

app.listen(port, () => console.log(`App listening on port ${port}!`));