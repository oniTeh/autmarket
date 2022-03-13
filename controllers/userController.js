const {login,register, logout,googleoAuthentry,googleoAuth2Callback,getContacts} = require('./authenticateController');
const { render, promiseImpl } = require('ejs');
const bodyParser = require('body-parser').urlencoded({extended:false});
const db = require('../config/dbconnection');
const user = require('../models/userSchema')
const { Mongoose } = require('mongoose');
const userSchema = require('../models/userSchema');
const passport = require('passport');
const { isAuth,setOAuthUserdata, isGoogleSignedIn } = require('../lib/authmiddleware');
const { erro_changer } = require('../config/activityStatus/userTodoActivity');
const Messages = require('../config/activityStatus/userTodoActivity').Messages;
const connection= require('../config/dbconnection');//getting to connect to perform action
const { json } = require('body-parser');
const path = require('path')
mongoose = require('mongoose');
const mongodb = require('mongodb');
const fs = require('fs');
const crypto = require('crypto');
const { dirname } = require('path');
const { discriminators } = require('../models/userSchema');
require('dotenv').config();
const dburl=process.env.DATABASE
const User = connection.models.User//all seaches access user db model and find matches
const axios = require('axios')


module.exports = function userController(app){
app.get('/register',(req,res)=>{
    res.render('register');

}).post("/register",bodyParser,register).get('/',bodyParser,(req,res)=>{
    res.render('login');

}).get("/allcontacts",bodyParser,isAuth,getContacts)
.get('/google/callback',bodyParser, passport.authenticate("google"),(req,res)=>{
    res.redirect('/profile');
})
.post('/login',bodyParser,passport.authenticate('local',{successRedirect:'/profile',failureRedirect:'/'}),(req,res,next)=>{
    res.render('login');
});


app.get("/profile",isAuth, erro_changer,async (req,res,done)=>{


    const {insertedId,_id,api_token,email,googled,phonenumber,name,picture}  = req.session?.passport.user
    try {
            if(email){
                res.render('my-profile',{_id,api_token,email,googled,phonenumber,name,picture})//)
            }else{
                return res.redirect('/')
            }
    } catch (error) {
        console.log(error);
        done(null)
    }
    
    
 



}).get('/dashboard',isAuth,isGoogleSignedIn,(req,res)=>{
    const {insertedId,_id,api_token,email,googled,phonenumber,name,picture}  = req.session?.passport.user
    res.render('dashboard',{insertedId,_id,api_token,email,googled,phonenumber,name,picture});
}).get('/change-password',(req,res)=>{
    const {insertedId,_id,api_token,email,googled,phonenumber,name,picture}  = req.session?.passport.user
    console.log(req.user);
    res.render('change-password',{insertedId,_id,api_token,email,googled,phonenumber,name,picture});
});

// UI request to change values of todo

app.post('/ui',isAuth,bodyParser,erro_changer,(req,res,next)=>{
    console.log(req.body);
    let user  = req.user;
    const {index, status, completedDate, timeCompleted }= req.body
    //req.user.todoes[index].Status = status
    User.findById(user).then((result)=>{
        if(!result){
            res.message  = new Messages(401,'an error occured')
            return res.json(res.message),next(null , res.message)
        }else{
            result.todoes[index].Status = status;
            result.todoes[index].completion_date = completedDate;
            result.todoes[index].timeCompleted = timeCompleted

            result.save().then(()=>{
                let newStatus =  result.todoes[index].Status 
                res.message = new Messages(200, 'status changed sucessfully ')
                res.status(200).json({newStatus:newStatus,message:res.message});
                next(null,erro_changer);
            })

        }
    });
});

// user videos in collection api
app.get('/myvideos',isAuth,(req,res)=>{
    let {firstname,lastname, username, email,videos } = req.user;
    profile = {
      data:videos,
      profile_name: username,
      email: email,
      fullName:`${firstname} ${lastname}`,
      status:{ status:res.message}
};
    video = JSON.parse( JSON.stringify(videos));
    if (videos.length < 1 ){
        return res.status(401).send("no video in your collection")
    }else{ 
    res.render('player',profile)
    }
 });



// userStreaming video API
app.get('/video/:video',isAuth, erro_changer,(req,res,done)=>{
    const {firstname,lastname, username, email,todoes, videos } = req.user;
    const myTodoes = JSON.parse(JSON.stringify(todoes));
    const myvideos = JSON.parse(JSON.stringify(videos))
    //console.log(myvideos[0].path)
   const path = req.params.video  
   if(path === null || path === undefined){
     return  res.json("path not found");
   } 

   const dbOption= {
    useNewUrlParser:true,
    useUnifiedTopology:true
};
    mongodb.MongoClient.connect(dburl,dbOption,(err,client)=>{
    if(err){
        console.log('there waas error connecting');
    }else{
        const db = client.db('tododb');
        const bucket = new mongodb.GridFSBucket(db,{
          chunkSizeBytes:1024,
          bucketName:'videos'
        });
        const head = {
            "Accept-Ranges":"bytes",
            "Content-Type": "video/mp4"
        }
        res.writeHead(200, head);
        bucket.openDownloadStreamByName(path).on("error",function(){
        console.log('error finding video data');     
    }).pipe(res)     
}})
});


/// thumpnail and picture API


 app.get('/images/:tumbnail',isAuth, erro_changer,(req,res,done)=>{
   console.log(req.params.tumbnail);
   const path = req.params.tumbnail 

   const dbOption= {
    useNewUrlParser:true,
    useUnifiedTopology:true
    };
    mongodb.MongoClient.connect(dburl,dbOption,(err,client)=>{
    if(err){
        console.log('there waas error connecting');
    }else{
        const db = client.db('tododb');
        const bucket = new mongodb.GridFSBucket(db,{
          chunkSizeBytes:1024,
          bucketName:'tumbnail'
        });
        const head = {
            "Accept-Ranges":"bytes",
            "Content-Type": "png"
        }
        res.writeHead(200, head);
        bucket.openDownloadStreamByName(path).on("error",function(){
        return res.json('error finding video data');
        
    }).pipe(res) 

}})
})

app.get('/status',(req,res,next)=>{
    console.log(req.params.id);
    res.send('status');
})

app.get('/logout',logout,(req,res)=>{
    res.redirect('/');
});

//  media player
app.get('/bplayer',(req,res)=>{


//    // res.render('bplayer')

    
})


app.get("*",(req,res)=>{
res.status(404).render('notfound');
});
  
filename = "mongo copy 2.mp4"
//const mypath = path.win32.join(process.cwd);
// console.log(mypath)
// try{
//     const file = fs.readFileSync(mypath,"UTF8")
//     if(file){
//         fs.unlinkSync(mypath);
//     }
// }catch(err){
//     console.log('err',+err);
// }

// try {
//     fs.open(mypath,'r',(err,data)=>{
//         if(err){
//             console.log("err")
//         }else{
//             fs.fstat(data,(err,stat)=>{
//                 if(err){console.log("err"+err)}else{
//                     console.log(stat)
//                 }
//             })
//             console.log(data)
//         }
//     }) 
// } catch (error) {
//     console.log(error)
// }


// function ny_vbid(p){
//     let mp4path = 'C://Users/Public/mp4/';
//     fs.mkdir(mp4path,(err)=>{
//         console.log(err)
//     })
//     let files = fs.readdirSync(p)//arays of files

//     files.forEach((data,index)=>{ 
//         let filep =  path.join(p,data);
//         if(path.extname(filep)===".mp4"){
//             let filename = data
//             let files = fs.readFileSync(filep)
//         fs.writeFile(`${mp4path}/${filename}`,files,()=>{
//         console.log('write'+filename)
//         }) 
//         };
    
       
//     })

//     // mp4file.forEach((file,index)=>{
//     //     console.log(index);
//     //   
//     //    })
      
//     // })
   
// }

//    ny_vbid('C://Users/Public/Downloads/The Complete Web Developer in 2019 Zero to Mastery/19. React.js + Redux')             
 }