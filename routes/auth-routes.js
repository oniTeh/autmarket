// contain all routh

const router = require('express').Router();
//auth login
router.get('/login',(req,res)=>{
    res.render('login');
 });

//auth with google
router.get('/google',(req,res)=>{
res.send('logging with google'); 
})

module.exports= router;