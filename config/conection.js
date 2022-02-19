const session = require('express-session')
const mongoose = require("mongoose");
const mongoStore = require("connect-mongo")(session);
require("dotenv").config();

console.log(process.env.DATABASE)
module.exports = {
    
    connection  :  async function conection(app) {
        const dburl= process.env.DATABASE//"mongodb://localhost:27017/tododb";
        const dbOption= {
            useNewUrlParser:true,
            useUnifiedTopology:true
        };
       const connection = mongoose.createConnection(dburl,dbOption,()=>{
           console.log('connected');
       });
// this creat connection and store cookies in sessions 
        const sessionStore = new mongoStore({
            mongooseConnection: connection,
            collections:'sessions',
        });
//using configuring session in app after connection
        app.use(session({
            secret:'blablabla',
            resave:false,
            store: sessionStore,
            saveUninitialized:true,
            cookie:{maxAge:1000 *60*60*24}//one day
        }));
        console.log('ran sessions');
     }
}
module.exports