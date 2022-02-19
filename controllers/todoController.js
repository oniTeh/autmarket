
const { isAuth } = require('../lib/authmiddleware');
const bodyParser = require('body-parser');
const Messages = require('../config/activityStatus/userTodoActivity').Messages;
const { erro_changer } = require('../config/activityStatus/userTodoActivity');
const urlencoded=bodyParser.urlencoded({extended:false});
const userTodo = require('../models/todoModel');
const connection= require('../config/dbconnection');//getting to connect to perform action
const User = connection.models.User//all seaches access user db model and find matches


module.exports= function router(app) {
// this contols routh and passing data to view engine
app.post('/addTodo',isAuth,urlencoded,erro_changer,(req,res ,next)=>{
    const  todo = new userTodo(req.body,userTodo)
    let user = req.session.passport.user;
    User.findById(user).then((result)=>{
        if(!result){
            res.message = new Messages(401, "Opps todo not Added :(");
            return  res.status(400).json(result.message), next(null,res.message)
        }else{
            let before = result.todoes.length
            console.log(before);
            result.todoes.push(todo)
            result.save().then((result)=>{
                let after = result.todoes.length
                console.log(after);
                if(after > before){
                    res.message = new Messages(200, "Aded! :)");
                    res.status(200).json(res.message);
                }else{
                    res.message = new Messages(401, "Opps todo not Added :(");
                    return  res.status(400).json(res.message), next(null,res.message)
                }
        })}});})


        //:::::::::::::::::::todo edit routh:::::::::::::

        app.post('/edit',isAuth,urlencoded,erro_changer,(req,res,next)=>{
           const {date_crerated, time, expected_endDate, id, item, index }  = req.body;

           let user = req.session.passport.user;
          let initial_value = req.user.todoes[index].item
            console.log(initial_value);
           User.findById(user).then((result)=>{
            result.todoes[index].item  = item;
            result.save().then((result)=>{
                let after_value = result.todoes[index].item
                if(initial_value != after_value){
                    res.message = new Messages( 200, "Update was success :)" );
                    res.status(200).json(res.message);
                    console.log('change success');
                
                }else{
                    res.message = new Messages( 400, "there was error Updaying:(" );
                    return  res.status(400).json(result.message), next(null,res.message);                }
            })     
           })       
     });

     // deleting todoes using filter method:::::////

        app.post('/delete',isAuth, urlencoded,erro_changer,(req,res, next)=>{
            console.log(req.body);
            const  index  = req.body.index;
            let user = req.session.passport.user;
            let initial_value = req.user.todoes.length;
            User.findById(user).then((result)=>{
            if(!result) {
                res.message = new Messages( 401, " You are not authorised :( ")
                return res.status(401).json(res.message), next(null, res.message);
            }else{
                    result.todoes[index].remove();
                    res.message = new Messages( 200, " success :) ")
                    result.save().then(()=>{
                    return res.status(200).json(res.message), next(null, res.message);
                })
            }
        })})}
