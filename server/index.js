var express = require("express");
const mongoose = require('mongoose');
const passport= require('passport')
var bodyParser = require('body-parser')
var session = require('express-session');

var userRouter= require('./routers/user.router');
var homeRouter= require('./routers/phongtro.router');
var homePageRouter= require('./routers/home.router');

const path = require("path");
var flash = require('connect-flash');
const Post = process.env.Post || 3001;
var app = express();
/* Khai báo để sử dụng kịch bản passport */
require('./config/passport.config');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
},(err)=>{
    if(err) console.log(err+"");
    console.log("connect database success");
});

app.use(session({
    name: 'login',
    secret : 'secured_key',
    resave : false,
    saveUninitialized : false,
    cookie:{
      maxAge:1000*60*15
    }
}))

app.use([
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  })
]);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
 

app.use('/nguoi-dung',userRouter);
app.use('/phong-tro',homeRouter);
app.use('/trang-chu',homePageRouter);




app.use(express.static(path.join(__dirname, "../client/build")));
/*React root*/
app.get("*", (req, res) => {
res.sendFile(path.join(__dirname + "../client/build/index.html"));
});


app.listen(Post,(err)=>{
    if(err) console.log(err);
    console.log(`Listen to ${Post}`);    
});
