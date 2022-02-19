const mongoose = require('mongoose');
const Usertodo = require('../models/todoModel');
const UserVideos = require('../models/videosModel')
require("dotenv").config();
const dburl=process.env.DATABASE;

const dbOption= {
    useNewUrlParser:true,
    useUnifiedTopology:true
}
console.log(dburl)
const connection = mongoose.createConnection(dburl,dbOption);

const userSchema = new mongoose.Schema({
  phonenumber: { type: Number,default:23341234657}, 
  username:String,
  firstname: String,
  lastname: String, 
  email:  String ,
  password: String,
  pkey: String,
  is_active: { type: Boolean, default: 0 },
  googleId: { type: String, default:"googleid" },
  api_token:{type:String,default:"api_token"}, 
  todoes: [
    Usertodo.schema
],
videos:[
  UserVideos.schema
]
})

const User = connection.model('User',userSchema);

module.exports = connection;