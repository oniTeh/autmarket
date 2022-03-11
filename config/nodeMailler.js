const { google } = require('googleapis');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
// initialising credentials

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRETE = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRETE, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token:REFRESH_TOKEN });


// function tohandle mail sending 

module.exports = async function sendMail(mailProps) {

   const  {address,subject,message,html,attachments} = mailProps; 

    try {
       // get access oken from google
    //    const ACCESS_TOKEN = await oAuth2Client.getAccessToken()

    //     //create transsort layer for  nodemailer to send email
    //     const transport = nodemailer.createTransport({
    //         service: "gmail",
    //         auth: {
    //             type: "OAuth2",
    //             user: "emason.tech@gmail.com",
    //             clientId: CLIENT_ID,
    //             clientSecret: CLIENT_SECRETE,
    //             refreshToken: REFRESH_TOKEN,
    //             accessToken: ACCESS_TOKEN
    //         }
    //     })


        const transport = nodemailer.createTransport({
            host: 'localhost',
            port: 5000,
            auth: {
                user: 'project.1',
                pass: 'secret.1'
            }
        });


        const mailOption = {
            from: "wamb>",
            to: address,
            subject: subject,
            text: message,
            html: html,
            attachments:attachments,   

        }

        const result = await transport.sendMail(mailOption);
        console.log("email is sending ..");
        return result,console.log(result);

    } catch (error) {
        return  console.log(error);
    }


}


