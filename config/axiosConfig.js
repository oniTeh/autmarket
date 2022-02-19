const axios = require ("axios");
module.exports = axios.create({
    baseURL:"https://autmarket.herokuapp.com",
    headers:{},//contain headers
    timeout:3000//timeout for request
})