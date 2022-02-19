const { genPassword,validatePassword }= require('../lib/passwordUtil');

const db = require('../config/dbconnection');
const userSchema = require('../models/userSchema');
const { json } = require('body-parser');


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

logout : async function logout (req,res,done){
console.log("loging out");
req.logout()
done(null);
},

register: async function register ( req,res,done){
    const { password } = req.body;
        await genPassword(password).then((result)=>{
         let { salt, hash } = result
         console.log(salt,hash);
          salt.toString;
          hash.toString;
         const userdata = {
            is_active: false,
            phonenumber: req.body.phonenumber, 
            firstname: req.body.firstname,
            username: req.body.username, 
            lastname: req.body.lastname, 
            email: req.body.email, 
            password:hash,
            pkey:salt,
            googleId: "notSet",
            api_token:"notset", 
            todoes: [{todo:'wash cloth'}]
            };
            const users = new userSchema(userdata);  
            db.collection('users').findOne({email:userdata.email}).then((result)=>{
            if (!result){
                db.collection('users').insertOne(users).then((users)=>{
                req.session.users=users;
                 done(null,users);
                });
            }
        }).catch()  
     done(null,users)
    
    })

}
}