require('dotenv').config()
const axios = require ("axios");
module.exports = axios.create({
    baseURL:process.env.BASEURL,
    headers:{
        withCredentials:true,
        origin:'*'
    },//contain headers
    timeout:3000//timeout for request
})