// contain all routh
const passport = require("passport");
const{ isAuth,isGoogleSignedIn }= require('../../lib/authmiddleware')
const {create_contact,getContacts,getLabel,contactInLabel,getPerson,create_group} = require('../../controllers/contactController')


const router = require('express').Router();
//get all gcontacts 
router.get('/',isGoogleSignedIn,isAuth,getContacts);
//create new contact route
router.get('/label',isGoogleSignedIn,isAuth,getLabel);
//get contacts in a label
router.get('/label_contact',isGoogleSignedIn,isAuth,contactInLabel);
//get contact details of resoureseName
router.get('/person',isGoogleSignedIn,isAuth,getPerson);
// :::::::::::::::::::create:::::::::::::::::::::::::://
router.get('/create_group',isGoogleSignedIn,isAuth,create_group);
//create contact 

router.get('/create_contact',isGoogleSignedIn,isAuth,create_contact);

module.exports= router;