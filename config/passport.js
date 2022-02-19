const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const connection= require('../config/dbconnection');
const User = connection.models.User
const { validatePassword }= require('../lib/passwordUtil');
//const { connection } = require('./conection');

const myField = {
    usernameField: 'email',
    passwordfield: 'password'
}


//::::creating verify custome verify callbac to be use by the strategy::::
const verifyCallback = function (username,password,done){
    username.toString(),password.toString();
    User.findOne({email:username}).then((user)=>{
        if(!user) return done(null,false);
        let pword = user.password;
        let pkey = user.pkey;
        
        validatePassword(password,pword,pkey).then((result)=>{
        if(result){
            return done(null , user );
        }else{
            return done(null , false );
        }

       });
       
    }).catch((err)=>{done(err)});

}

const strategy = new localStrategy(myField, verifyCallback)
passport.use(strategy)

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser((userId, done)=>{
User.findById(userId).then((user)=>{
    done(null, user);
}).catch(err => done(err))});
