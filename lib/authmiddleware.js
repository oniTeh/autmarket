require("dotenv").config();
const { google } = require("googleapis");
const fs = require("fs");
const passport = require("passport");
const Gaxios = require("gaxios");
const axios = require("axios");
const connection = require("../config/dbconnection"); //getting to connect to perform action
const User = connection.models.User; //all seaches access user db model and find matches

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRETE = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

const credentials = {
  CLIENT_ID,
  CLIENT_SECRETE,
  redirectUri,
  grant_type: "code",
  response_type: "code",
  access_type: "offline",
};

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   try {
//     done(null, user);
//   } catch (error) {
//     console.log(error.message);
//   }

//   // console.log(user);
// });

// get tokens from google tokens api

// const get_google_tokens = (code)=>{

//   try {

//       axios.post(`https://oauth2.googleapis.com/token`,{
//         client_id:CLIENT_ID,
//         client_secret:CLIENT_SECRETE,
//         redirect_uri:redirectUri,
//         grant_type: "authorization_code",
//         response_type:"code",
//         code:code,
//         access_type: "offline",

//       })
//       .then((err,data)=>{
//         if(err) return console.log(err)
//         return data.data
//       });

//   } catch (error) {
//     console.log(error.message)
//   }
// }

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).redirect("/");
  }
};

module.exports.isGoogleSignedIn = (req, res, next) => {
  if (req.session.passport?.user?.is_active != undefined) {
    console.log("googlesingin ckecked");
    next();
  } else {
    //handle google auth2.02

    return res.status(401).redirect("/auth/google");
  }
};

module.exports.setOAuthUserdata = async (req, res, done) => {
  const { code } = req.query;
  req.code = code;
 
  const auth = new google.auth.OAuth2({
    keyfile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  auth.setCredentials(credentials);
  auth._clientId = CLIENT_ID;
  auth._clientSecret = CLIENT_SECRETE;
  auth.redirectUri = redirectUri;
  auth._redirectUrl = redirectUri;

  // geting tokens from google token api

  const getUserToken = async () => {
    try {
      const userToken = await auth.getToken(code);
      return userToken.then(data=>data)
      // return { ...userToken.tokens, ...req.query };
    } catch (error) {
      console.log(error.message);
    }
  };

  const getGoogleUser = async () => {
    try {
      getUserToken().then((tokens) => {
        console.log(tokens)
        const { id_token, access_token } = tokens;

        Gaxios.instance.defaults = {
          baseURL: process.env.GOOGLE_URL,
          headers: {
            authorization: `Bearer ${id_token}`,
            credentials,
          },
        };
        const userdata = Gaxios.request({
          url: `/oauth2/v1/userinfo?access_token=${access_token}`,
        }); 
        return userdata.then((userinfo) => ({
          ...userinfo?.data,
        }));
      });
    } catch (error) {
      console.log(error, "error fetching Google user data");
    }
  };

  getGoogleUser().then((data) => {
    console.log(data)
    done(null, data);
  });
};
