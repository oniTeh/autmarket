mongoose = require('mongoose');
const mongodb = require('mongodb');
const fs = require('fs');
const router = require('express').Router();
const crypto = require('crypto');
const path = require('path');
require("dotenv").config();
const dburl=process.env.DATABASE;

// variable to fire the upload operation
router.get('/upload',(req,res)=>{
    res.render('video_upload')
})

//::::::: uploading file to db:::://///

router.post('/upload',(req,res,next)=>{
    // from upload form
const details = {
    _id :"5ee5e2b231676d3b2fdd279c",
    "title":"Star Wars: Episode I - The Phantom Menace",
    "year":1999,
    "rated":"PG",
    "runtime":136,
    "countries":["USA"],
    "genres":["Action","Adventure","Fantasy"],
    "director":"George Lucas",
    "writers":["George Lucas"],
    "actors":["Liam Neeson","Ewan McGregor","Natalie Portman","Jake Lloyd"],
    "plot":"Two Jedi Knights escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force, but the long dormant Sith resurface to reclaim their old glory.",
    "poster":"http://ia.media-imdb.com/images/M/MV5BMTQ4NjEwNDA2Nl5BMl5BanBnXkFtZTcwNDUyNDQzNw@@._V1_SX300.jpg",
    "imdb":{"id":"tt0120915","rating":6.5,"votes":494267},"tomato":null,"metacritic":51,
    "awards":{"wins":17,"nominations":59,"text":"Nominated for 3 Oscars. Another 17 wins & 59 nominations."},
    "type":"movie"
}

    const dbOption= {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
    mongodb.MongoClient.connect(dburl,dbOption,(err,client)=>{
        if(err){
            console.log('there waas error connecting');
        }else{
           const videoPath = "./public/assets/mongo.mp4";
           const tumbnailPath = './public/assets/posterxytnx.png'
           const extension = function(filelocation){
               let myext = path.win32.extname(filelocation)
               if(myext == '.mp4'){
                   console.log('video file')
               }else{
                   console.log('picture file');
               }
               return myext
           }
            // getting fileName :: generate from crypto leter   
           let fileName = function (filepat){
               return path.win32.basename(filepat,extension(filepat));
           }
           // creating upload requestt for video file
           const db = client.db('movieDB');
           const bucket = new mongodb.GridFSBucket(db,{
             chunkSizeBytes:1024,
             bucketName:fileName(videoPath)
         });
           fs.createReadStream(videoPath).pipe(bucket.openUploadStream(fileName(videoPath))).on('finish',(data)=>{
            const db = client.db('movieDB');
            const bucket = new mongodb.GridFSBucket(db,{
                chunkSizeBytes:1024,
                bucketName:fileName(tumbnailPath)
            });
               // setting movie id to tumbnail id  
               details.movieId =  data._id
               fs.createReadStream(tumbnailPath).pipe(bucket.openUploadStream(details)).on('finish',(data)=>{
                   console.log(data);
                   res.send('success')
               })
          })
       }
})})



///::::::streaming file from db///::::
 router.get('/player',(req,res)=>{
    //console.log(req.params.video)

    const dbOption= {
        useNewUrlParser:true,
        useUnifiedTopology:true
    };
        mongodb.MongoClient.connect(dburl,dbOption,(err,client)=>{
        if(err){
            console.log('there waas error connecting');
        }else{
            const db = client.db('movieDB');
            const bucket = new mongodb.GridFSBucket(db,{
              chunkSizeBytes:1024,
              bucketName:'videos'
            });
            const head = {
                "Accept-Ranges":"bytes",
                "Content-Type": "video/mp4"
            };
            res.writeHead(200, head);
            bucket.openDownloadStreamByName("mongo.mp4").on("error",function(){
            console.log('error finding video data');
        }).pipe(res)
    }})
   
 })
module.exports = router;