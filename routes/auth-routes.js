// contain all routh
const {login,googleoAuthentry,googleoAuth2Callback} = require('../controllers/authenticateController');

const router = require('express').Router();
//auth login
router.get('/login',(req,res)=>{
    res.render('login');
 });

//auth with googles
router.get('/google',googleoAuthentry)

module.exports= router;