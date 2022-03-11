const passport = require("passport");
const { google } = require("googleapis");
const people = google.people("v1");

//all google contact groups or labels
const getGroups = () => {
  try {
    return people.contactGroups
      .list({
        groupFields: "clientData,groupType,memberCount,name",
        pageSize: 1000,
      })
      .then((labels) => {
        let data = JSON.parse(JSON.stringify(labels));
        return data.data;
      });
  } catch (error) {
    console.log(error);
    return error;
  }
};

//all google contact list
const getAllGoogleContacts = () => {
  try {
    return people.people.connections
      .list({
        resourceName: "people/me",
        pageSize: 1000,
        personFields: "names,emailAddresses,phoneNumbers",
      })
      .then((contacts) => {
        let data = JSON.parse(JSON.stringify(contacts));
        return data.data;
      });
  } catch (error) {
    done(error);
  }
};

//get all contact ina givengroup
const getContactsInGroup = (resourceName) => {
  try {
    return people.contactGroups
      .get({
        resourceName: resourceName,
        maxMembers: 1000,
      })
      .then((contact) => {
        let data = JSON.parse(JSON.stringify(contact));
        return data.data;
      });
  } catch (error) {
    console.log(error);
  }
};

//get a  contact usng its googleid
const getPersonContactDetails = (personId) => {
  try {
    return people.people
      .get({
        resourceName: personId,
        personFields: "names,emailAddresses,phoneNumbers",
      })
      .then((contact) => {
        let data = JSON.parse(JSON.stringify(contact));
        return data.data;
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getContacts: async (req, res, done) => {
    try {
      const mycontacts = getAllGoogleContacts().then((data) => data);
      mycontacts.then((data) => res.status(200).json(data));
    } catch (error) {
      done(error);
    }
  },

  createContacts: (req, res, done) => {
    res.status(200).send("CREATE");
  },

  getLabel: async (req, res) => {
    try {
      let userGoogleContactsGroups = getGroups().then((data) =>
        JSON.parse(JSON.stringify(data))
      );
      userGoogleContactsGroups.then((data) => res.status(200).json(data));
    } catch (error) {
      console.log(error);
    }
  },

  contactInLabel: async (req, res) => {
    console.log(req.query);
    const { resourceName } = req.query;
    try {
      let contactsInGroup = getContactsInGroup(resourceName).then((data) =>
        JSON.parse(JSON.stringify(data))
      );
      contactsInGroup.then((data) => res.status(200).json(data));
    } catch (error) {}
  },

  getPerson: async (req, res) => {
    console.log(req.query);
    try {
      const { resourceName } = req.query;
      let details = getPersonContactDetails(resourceName).then((data) =>
        JSON.parse(JSON.stringify(data))
      );
      details.then((data) => res.status(200).json(data));
    } catch (error) {
      console.log(error);
    }
  },

  create_group: (req, res) => {
    const {groupName} = JSON.parse(JSON.stringify(req.query));
    console.log(groupName)
    try {
      //create group or label
      let userGoogleContactsGroups = getGroups().then((data) =>
        JSON.parse(JSON.stringify(data))
      );
      let userGroups = userGoogleContactsGroups.then(({ contactGroups }) => {
        let names = contactGroups.map((group) => `${group.name}`);
        return names;
      });

      userGroups.then(async (data) => {
        if (data.includes(`${groupName}`)) {
          return res.status(301).json({ code: 301, mesage: "group exist" });
        } else {
          try {     
            const resp = await people.contactGroups.create({
              requestBody: {
                "contactGroup": {
                  "name": `${groupName}`
                }
              }
            })
              res.status(200).json(resp.data)
          } catch (error) {
            res.status(400).json({code:400,message:error.messagee})
            console.log(error)
          }
        
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
};
