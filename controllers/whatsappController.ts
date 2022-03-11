
const passport = require("passport");
const { google } = require("googleapis");
const people = google.people("v1");
const qrcode = require('qrcode-terminal');
const  {  makeWALegacySocket ,DisconnectReason} = require( '@adiwajshing/baileys');
var makeWASocket = require( '@adiwajshing/baileys').default


//all google contact groups or labels

const initialiseUserclient = (req,res,done)=>{
    console.log(makeWASocket)

    // import makeWASocket, { DisconnectReason } from '@adiwajshing/baileys'
    // import { Boom } from '@hapi/boom'
    
    async function connectToWhatsApp () {
        const sock = makeWASocket({
            // can provide additional config here
            printQRInTerminal: true
        })
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if(connection === 'close') {
                const shouldReconnect = ((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut)
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
                // reconnect if not logged out
                if(shouldReconnect) {
                    connectToWhatsApp()
                }
            } else if(connection === 'open') {
                console.log('opened connection')
            }
        })

        console.log(sock.ev);

        sock.ev.on('messages.upsert', async (m) => {
            console.log(JSON.stringify(m, undefined, 2))
    
            console.log('replying to', m.messages[0].key.remoteJid)
            await sock.sendMessage(m.messages[0].key.remoteJid, { text: 'Hello there!' })
        })
    }
    // run in main file
    connectToWhatsApp()
 res.status(200).json({code:200,message:'hell chat'});
}

module.exports  = {
    initialiseUserclient
    
}

// const getGroups = () => {
//   try {
//     return people.contactGroups
//       .list({
//         groupFields: "clientData,groupType,memberCount,name",
//         pageSize: 1000,
//       })
//       .then((labels) => {
//         let data = JSON.parse(JSON.stringify(labels));
//         return data.data;
//       });
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

// //all google contact list
// const getAllGoogleContacts = () => {
//   try {
//     return people.people.connections
//       .list({
//         resourceName: "people/me",
//         pageSize: 1000,
//         personFields: "names,emailAddresses,phoneNumbers",
//       })
//       .then((contacts) => {
//         let data = JSON.parse(JSON.stringify(contacts));
//         return data.data;
//       });
//   } catch (error) {
//     done(error);
//   }
// };

// //get all contact ina givengroup
// const getContactsInGroup = (resourceName) => {
//   try {
//     return people.contactGroups
//       .get({
//         resourceName: resourceName,
//         maxMembers: 1000,
//       })
//       .then((contact) => {
//         let data = JSON.parse(JSON.stringify(contact));
//         return data.data;
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //get a  contact usng its googleid
// const getPersonContactDetails = (personId) => {
//   try {
//     return people.people
//       .get({
//         resourceName: personId,
//         personFields: "names,emailAddresses,phoneNumbers",
//       })
//       .then((contact) => {
//         let data = JSON.parse(JSON.stringify(contact));
//         return data.data;
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports = {
//   getContacts: async (req, res, done) => {
//     try {
//       const mycontacts = getAllGoogleContacts().then((data) => data);
//       mycontacts.then((data) => res.status(200).json(data));
//     } catch (error) {
//       done(error);
//     }
//   },

//   createContacts: (req, res, done) => {
//     res.status(200).send("CREATE");
//   },

//   getLabel: async (req, res) => {
//     try {
//       let userGoogleContactsGroups = getGroups().then((data) =>
//         JSON.parse(JSON.stringify(data))
//       );
//       userGoogleContactsGroups.then((data) => res.status(200).json(data));
//     } catch (error) {
//       console.log(error);
//     }
//   },

//   contactInLabel: async (req, res) => {
//     console.log(req.query);
//     const { resourceName } = req.query;
//     try {
//       let contactsInGroup = getContactsInGroup(resourceName).then((data) =>
//         JSON.parse(JSON.stringify(data))
//       );
//       contactsInGroup.then((data) => res.status(200).json(data));
//     } catch (error) {}
//   },

//   getPerson: async (req, res) => {
//     console.log(req.query);
//     try {
//       const { resourceName } = req.query;
//       let details = getPersonContactDetails(resourceName).then((data) =>
//         JSON.parse(JSON.stringify(data))
//       );
//       details.then((data) => res.status(200).json(data));
//     } catch (error) {
//       console.log(error);
//     }
//   },

//   create_group: (req, res) => {
//     try {
//       //create group or label
//       let userGoogleContactsGroups = getGroups().then((data) =>
//         JSON.parse(JSON.stringify(data))
//       );
//       let userGroups = userGoogleContactsGroups.then(({ contactGroups }) => {
//         let names = contactGroups.map((group) => `${group.name}`);
//         return names;
//       });

//       userGroups.then((data) => {
//         if (data.includes("amazoggn")) {
//           return res.status(301).json({ code: 301, mesage: "group exist" });
//         } else {
//           // let name =" amazoggn";
//           try {     
          
//               contactGroup={
//                 name:"hotmail"
//               }
            
//            let strdata  = JSON.parse(JSON.stringify({contactGroup}));
  
//            console.log(strdata);

//             let mydata = people.contactGroups.create(strdata)
//             if (mydata) {
//               console.log(mydata)
//             } else {
//               return "error occured"
//             }
        
//           } catch (error) {
//             console.log(error)
//           }
        
//         }
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   },
// };
