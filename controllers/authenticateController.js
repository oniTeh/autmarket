const { genPassword, validatePassword } = require("../lib/passwordUtil");

const googleapis = require("googleapis");
const db = require("../config/dbconnection");
const userSchema = require("../models/userSchema");
const { json } = require("body-parser");

const passport = require("passport");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const connection = require("../config/dbconnection"); //getting to connect to perform action
const User = connection.models.User; //all seaches access user db model and find matches
const axios = require("../config/axiosConfig");
const { google } = require("googleapis");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  try {
    done(null, user);
  } catch (error) {
    console.log(error.message);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
      access_type: "offline",
      response_type: "code",
    },
    function (accessToken, refreshToken, profile, done) {
      //find usr in db with profile id to check wetherthey arerefgistered
      console.log(accessToken, refreshToken, profile, done);

      let data = { accessToken, refreshToken, ...profile._json };

      try {
        //  console.log(data);

        axios.post("/register", data).then((data) => {
          done(null, data.data);
        });
      } catch (error) {
        console.log(error.message);
        res.redirect('/')
      }
      console.log("running credentials");
    }
  )
);

module.exports = {
  //  login: async function login (req,res,next) {
  //         let password = req.body.password.toString();
  //         let email = req.body.email.toString();
  //         console.log(email,password);
  //        await db.collection('users').findOne({email:email}).then((result)=>{
  //        if(!result){
  //             res.redirect("/");
  //           return  next();
  //        }else{

  //         let pword = result.password.toString();
  //         let pkey = result.pkey.toString();

  //         validatePassword(password,pword,pkey).then((result)=>{
  //            if(!result){
  //                res.redirect('/');
  //                next()
  //            }else{
  //                let email = req.body.email
  //                db.collection('users').findOne({email:email}).then((result)=>{
  //                    req.session.profile = result.email;
  //                    res.redirect('/profile'),next();

  //                })

  //            }
  //         })

  //        }
  //    }).catch()

  // },

  //register handler;

  logout: async function logout(req, res, done) {
    console.log("loging out");
    req.logout();
    done(null);
  },

  register: async function register(req, res, done) {
   
    const {
      firstname,
      phonenumber,
      family_name,
      given_name,
      id_token,
      name,
      picture,
      access_token,
      scope,
      code,
      email_verified,
      id,refreshToken,
      email,
      verified_email,
      gtoken_expiry_date,
      username,
      lastname,
      password,
      accessToken,sub
    } = JSON.parse(JSON.stringify(req.body));

    try {
      await genPassword(password ? password : email).then((result) => {
        let { salt, hash } = result;
        salt.toString;
        hash.toString;
        const userdata = {
          username: username ? username : `${family_name}`,
          picture,
          scope,
          id_token,
          access_token,
          lastname: lastname ? lastname : given_name,
          is_active: email_verified,
          phonenumber: phonenumber,
          firstname: firstname ? firstname : family_name,
          name: name ? name : `${firstname} ${lastname}`,
          email: email,
          code: code,
          refreshToken,
          gtoken_expiry_date,
          password: hash,
          pkey: salt,
          googleId: sub,
          api_token: accessToken,
          todoes: [{ todo: "wash cloth" }],
        };
        const user = new userSchema(userdata);
        db.collection("users")
          .findOne({ email: userdata.email })
          .then((result) => {
            if (result) {
              result = JSON.parse(JSON.stringify(result))
              return res.status(200).json(result);
            } else {
              db.collection("users")
                .insertOne(user)
                .then((record) => {
                  result = JSON.parse(JSON.stringify(record))
                  return res.status(200).json(record);
                });
            }
          });
      });
    } catch (error) {
      console.log(error.message);
    }
  }, //end of app reg

  googleoAuthentry: passport.authenticate("google", {
    scope: [
      "https://www.google.com/m8/feeds",
      "https://www.googleapis.com/auth/contacts",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/script.container.ui",
    ],
    accessType: "offline",
    responseType: "code",
    prompt:"consent",
    successRedirect: "/google/callback",
    failureRedirect: "/",
  }),

  getContacts: async (req, res, done) => {
    console.log( req.session.passport.user.api_token);
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRETE = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;

    const credentials = {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      CLIENT_SECRETE: process.env.GOOGLE_CLIENT_SECRET,
      access_token: req.session.passport.user.api_token.toString(),
      refresh_token:req.session.passport.user.refreshToken
    };

    const auth = new google.auth.OAuth2({
      keyfile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    auth.setCredentials(credentials);
    auth._clientId = CLIENT_ID;
    auth._clientSecret = CLIENT_SECRETE;
    auth._redirectUrl = REDIRECT_URI;
  
    try {
      google.options({
        access_token:req.session.passport.user.api_token,
        refresh_token:req.session.passport.user.refreshToken,
        auth,
      });
     
      const people = google.people("v1").people;

      const mycontacts = await people.connections.list({
        auth: auth,
        resourceName: `people/me`,
        pageSize:1000,
        personFields: "names,emailAddresses,phoneNumbers",
      });
      res.status(200).json(mycontacts.data);
      // res.send('check')
    } catch (error) {
      done(error);
    }
  },
};
