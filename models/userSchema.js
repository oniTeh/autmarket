const mongoose = require('mongoose')
const Usertodo = require('./todoModel');
const UserVideos = require('./videosModel');
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
],
videoCollections:{type:Array, default:{url:"abc",poster:"abc"}}
})
module.exports = mongoose.model('userSchema', userSchema);