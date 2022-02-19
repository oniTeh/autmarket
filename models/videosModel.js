const mongoose = require('mongoose')

const UserVideos = new mongoose.Schema({
    title:String,
    year:Number,
    rated:String,
    runtime:Number,
    countries:Array,
    poster:String,
    genres:Array,
    directors:String,
    writers:Array,
    actors:Array,
    plot: String,
    imdb: Object,
    awards: Object,
    type: String,
    tumbnailPath:String,
    videoTime: String,
    videoTitle:String,
    watchedstatus:Boolean,
    durationStreamed: String
})

//"plot":"Two Jedi Knights escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force, but the long dormant Sith resurface to reclaim their old glory.",
//"imdb":{"id":"tt0120915","rating":6.5,"votes":494267},"tomato":null,"metacritic":51,
//"awards":{"wins":17,"nominations":59,"text":"Nominated for 3 Oscars. Another 17 wins & 59 nominations."},

module.exports = mongoose.model('userVideos', UserVideos)