var express = require('express');
var app = express();
const cors = require ('cors');
const session = require('express-session')
const mongoSore = require("connect-mongo")(session);
const { connection } = require('./config/conection');
const passport  = require('passport');
const { google } = require("googleapis");

require("dotenv").config()
//const erro_changer  = require('./config/activityStatus/userTodoActivity').erro_changer





connection(app)
app.use(passport.initialize());
app.use(passport.session());

//:::::::::::require rouths:::::::::::::: 
const authRoutes = require('./routes/auth-routes');
const stream = require('./routes/stream');
const dbstreaming = require('./routes/dbStreaming');
const contact_route = require('./routes/contact_route/contactRoute')
// const whatsapp_route = require('./routes/whatsapp_route/whatsapp_routes')
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
//setting google details for api calls
app.use((req,res,next)=>{
  if(req?.session.passport?.user !== undefined){
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRETE = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const credentials = {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      CLIENT_SECRETE: process.env.GOOGLE_CLIENT_SECRET,
      access_token: req.session.passport.user?.api_token,
      refresh_token:req.session.passport.user.refreshToken
    };

    const auth = new google.auth.OAuth2({
      keyfile: `./${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
    });

    auth.setCredentials(credentials);
    auth._clientId = CLIENT_ID;
    auth._clientSecret = CLIENT_SECRETE;
    auth._redirectUrl = REDIRECT_URI;
    
    try {
      google.options({
        access_token:req.session.passport.user?.api_token,
        refresh_token:req.session.passport.user?.refreshToken,
        auth,
      });
    
    } catch (error) {
      next(error);
    }
    next(null);
  }else{
    next(null);
  }
 
  
})

app.use('/auth',authRoutes);
//google contact api_controller
app.use('/profile/contact', contact_route)
// app.use('/whatsapp',whatsapp_route)
//sreaming route
app.use('/dbs', dbstreaming);
app.use('/stream',stream)

 app.use((req,res,next)=>{
  // console.log(req.body);
  //  console.log(req.session);

    next();
});




require('./config/passport');
// require('./config/google-passport-setup')
// app.use((req, res, next) => {   
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-reqed-With");
//     res.header("Access-Control-Allow-Methods", "PATCH,POST,GET,PUT,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//     next();
//   });

  app.use(
    cors({
      origin: "http://localhost:3000", // <-- location of the react app were connecting to
      credentials: true,
    })
  );


// app.use(passport.initialize());
// app.use(passport.session());


// calling todocontroller with full (express)app
userController(app);
todoController(app);

const port = process.env.PORT||3000;
app.listen(port)
console.log("listening to port",port);