const connection= require('../../config/dbconnection');//getting to connect to perform action
const User = connection.models.User//all seaches access user db model and find matches
mongoose = require('mongoose');

module.exports= {
   

    get_user_profile: async (req,res)=>{
        try {
            const {_id,api_token,email,googleId}  = req.session.passport.user;
            return  await User.findById({_id}).then(data=>data);
        } catch (error) {
            console.log(error);
        }
        
    }
}