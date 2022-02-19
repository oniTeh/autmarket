var express = require('express');
var app = express();
const session = require('express-session')
const mongoSore = require("connect-mongo")(session);
const { connection } = require('./config/conection');
const passport  = require('passport');
const authRoutes = require('./routes/auth-routes');
const stream = require('./routes/stream');
const dbstreaming = require('./routes/dbStreaming')
require("dotenv").config()
//const erro_changer  = require('./config/activityStatus/userTodoActivity').erro_changer

connection(app)
//:::::::::::require rouths:::::::::::::: 

//::::::::::require controloers::::::::::::::

var todoController = require('./controllers/todoController');// access files and functions in todocontrolers
var userController = require('./controllers/userController');
const bodyParser = require('body-parser');
//:::::::::::setup routes::::::::::::::
//set up template engin
app.set('view engine', 'ejs');
//static files serving
app.use(express.static('./public'));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/auth',authRoutes);
app.use('/dbs', dbstreaming);
app.use('/stream',stream)
 app.use((req,res,next)=>{
  //console.log(req.body);
   console.log(req.session);
    next();
});

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());


// calling todocontroller with full (express)app

userController(app);
todoController(app);
const port = process.env.PORT||5000;
app.listen(port)
console.log("listening to port",port);
