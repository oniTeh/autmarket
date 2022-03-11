// this software is built by onitech,
// anypart of this code that should be used requires the parmission of the developer
// or any third party company authorised by 
// onitech to issue right to use.
// feel free to request right to use if need be 
// "oni.techgroup@gmail.com"

 

function onOpen() {
  
 try{
   var ui = SpreadsheetApp.getUi();
 ui.createMenu('App').addItem('WiZam', 'toggleApp')
    .addToUi()
 }catch(error){
  console.log('error in ui '+error);
 }
}



function showDialog(message) {
   var ui = SpreadsheetApp.getUi();
 try{
var response = ui.alert(`${message}`, ui.ButtonSet.YES_NO);
if (response == ui.Button.YES) {
  return true;
} else {
  return false
}
 }catch(error){
   console.log("error occured in showDaialog")
 }   

}


var scriptProperties = PropertiesService.getScriptProperties();
var userProperties = PropertiesService.getUserProperties();



const { userEmail, userContactLabel, getNotified } = userProperties.getProperties();
var emailNotification = getNotified;
var emailAddress = userEmail;
let contactLabel = userContactLabel;



async function setPropertyLabel(phone) {
   let currentGroupContacts = getGruopContactsResourceName()?.map((data) => getPhoneNumberByResourcesName(data));

  let {userContacts} =  userProperties.getProperties();
  
  try {
    if (userContacts == "undefined") {
      currentGroupContacts?.push(`${phone}`);
      userProperties.setProperty("userContacts", `${currentGroupContacts?.length>0?currentGroupContacts?.toString():currentGroupContacts?.toString()}`);
      
    }else{
if(!(userContacts?.includes(`${phone}`))){
    // addTooContact()
     currentGroupContacts?.push(`${phone}`)
     userProperties.setProperty("userContacts",`${currentGroupContacts?.length>0?currentGroupContacts?.toString():currentGroupContacts?.toString()}`)
    return true
  }else{
    return false;
  }
    
    }
    
  } catch (error) {
    console.log(error)
  }
  
}


const setNotification = (data)=>{
  var ui = SpreadsheetApp.getUi();
  if( showDialog("do you want to continue !")){
   if(data ==`${emailNotification}`&& data=="on"){
        ui.alert( "Notification is already activated");

     }else if(data ==`${emailNotification}`&& data=="off"){
         ui.alert( "Notification is already deactivated");
      
     }else{
        userProperties.setProperty('getNotified', `${data}`);
        ui.alert( `Notification turned ${data}`); 
     }
  }else{
    ui.alert("process canceled");
  }
  return 
    
  };


let groupName = userContactLabel ? userContactLabel : SpreadsheetApp.getActiveSheet().getName();//get formName and store in a 

const createNewGruop = (gname) => {
  try{
let newGroupData = {
    "contactGroup": {
      "name": `${gname}`
    }
  }
  let mydata = People.ContactGroups.create(JSON.stringify(newGroupData))
  if (mydata) {
    return mydata
  } else {
    return "error occured"
  }
  }catch(error){
console.log("error occured")
  }
  
}

const getGruopContactsResourceName = () => {
  try{
let userGroupList = () => People.ContactGroups.list().contactGroups;
  if (getUserGruop().toString().includes(`${contactLabel}`)) {

    let activeLableResourceName = userGroupList().filter(data => data.formattedName == `${contactLabel}`)[0].resourceName
    // console.log(activeLableResourceName)
    let memberNames = People.ContactGroups.get(resourceName = `${activeLableResourceName}`, { maxMembers: 1000 })?.memberResourceNames
    if (memberNames != undefined) {
      return memberNames;
    } else {
      return [];
    }

  } else {
    createNewGruop(`${contactLabel}`);
    return getGruopContactsResourceName();
  }
  }catch(error){
console.log("erroe occured in contatct creation")
  }
  
}




const getPhoneNumberByResourcesName = (resourcesName) => {
  try {
      let people = People.People.get(`${resourcesName}`, {
    personFields: 'phoneNumbers'
  })
  let udata = JSON.parse(people)
  const { phoneNumbers } = udata;
  return phoneNumbers[0].value
  }catch(error){
    console.log("error occured")
  }

}

const getUserGruop = () => {
  try {
     let userGroupList = () => People.ContactGroups.list().contactGroups;
  const allUsergroup = userGroupList().map((data) => data.name)
  return allUsergroup
  }catch(error){
    console.log("error occured")
  }
  let userGroupList = () => People.ContactGroups.list().contactGroups;
  const allUsergroup = userGroupList().map((data) => data.name)
  return allUsergroup
}





//function to be called from frontend
function getActiveSetting() {
  return JSON.stringify({ userEmail, userContactLabel, getNotified })
}

function toggleApp() {
  var html = HtmlService.createTemplateFromFile('appIndex').evaluate().setTitle('Onitech Contact App')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}



function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();

}
//user actin area

//createNewLabel
const serverHandleCreateLabel = (data) => {
  let { labelName } = data
  let currentLabels = getUserGruop();
  if (currentLabels.toString().includes(labelName.toString())) {
    return `${labelName} already exist`;
  } else {
    createNewGruop(labelName)
    return `${labelName} created successfully`
  }
}

function processForm(formObject) {
  const { email, label, notification } = formObject;
  if (email) {
    userProperties.setProperty('userEmail', `${email}`);
  };
  if (label) {
    userProperties.setProperty('userContactLabel', `${label}`);
  };
 

  return
}

const getTotalContacts = () => {
  try{
    let contactList = People.ContactGroups.list().contactGroups.map((data) => {
    return { label: data.formattedName, totalContacts: data.memberCount }
  })
  return JSON.stringify(contactList);
  }catch(error){
    console.log(error)
  }
  

}

// DO NOT EDIT THESE NEXT PARAMS
var isNewSheet = false;
var recivedData = [];

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('appIndex');
}


// Webhook Receiver - triggered with form webhook to pusblished App URL.
  const analys = async () =>{
  let currentGroupContacts = getGruopContactsResourceName()?.map((data) => getPhoneNumberByResourcesName(data));
  userProperties.setProperty('userContacts',currentGroupContacts.toString());
  var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss?.getSheetByName(`${groupName}`)
    var headerRows = 1;
    var MaxRow = sheet?.getLastRow();
    var dataRange = sheet?.getDataRange();
    var data = dataRange?.getValues();     // Read all data
    data?.splice(0, headerRows);// Remove header rows

  data.map((inc)=>{
     const {userContacts} =  userProperties.getProperties();
      if(!(userContacts.toString().includes(inc[2]))){ 
        currentGroupContacts.push(inc[2].toString())
        let props = currentGroupContacts.toString();
        userProperties.setProperty("userContacts",`${props}`) 
        return addTocontact(inc)
      }else{
       return console.log('added aleady')
      }
    })
    return "analysis ended";
  }
 


function doPost(e) {
  userContactGroup();
  var params = JSON.stringify(e?.parameter);
  params =(e?.parameter)?JSON.parse(params):null;
  if(params){
    insertToSheet(params).then(()=>HtmlService.createHtmlOutput("post request received"));
  analys().then((data)=>console.log(data));
  
  }else{
  analys().then((data)=>console.log(data))

  }
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss?.getSheetByName(`${groupName}`)
    var headerRows = 1;
    var MaxRow = sheet?.getLastRow();
    var dataRange = sheet?.getDataRange();
    var data = dataRange?.getValues();     // Read all data
    data?.splice(0, headerRows);// Remove header rows
    
  return HtmlService.createHtmlOutput("post request received");
}



// Flattens a nested object for easier use with a spreadsheet
function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}



// normalize headers
function getHeaders(formSheet, keys) {
  var headers = [];

  // retrieve existing headers
  if (!isNewSheet) {
    headers = formSheet.getRange(1, 1, 1, formSheet.getLastColumn()).getValues()[0];
  }

  // add any additional headers
  var newHeaders = [];
  newHeaders = keys.filter(function (k) {
    return headers.indexOf(k) > -1 ? false : k;
  });

  newHeaders.forEach(function (h) {
    headers.push(h);
  });
  return headers;
}

// normalize values
function getValues(headers, flat) {
  var values = [];
  // push values based on headers
  headers.forEach(function (h) {
    values.push(flat[h]);
  });
  return values;
}

// Insert headers
function setHeaders(sheet, values) {
  var headerRow = sheet.getRange(1, 1, 1, values.length)
  headerRow.setValues([values]);
  headerRow.setFontWeight("bold").setHorizontalAlignment("center");
}

// Insert Data into Sheet
function setValues(sheet, values) {
  var lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.insertRowAfter(lastRow);
  sheet.getRange(lastRow + 1, 1, 1, values.length).setValues([values])
    .setFontWeight("normal").setHorizontalAlignment("center");
  return true
}

// Find or create sheet for form
function getFormSheet(formName) {
  var formSheet;
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet();

  // create sheet if needed
  if (activeSheet.getSheetByName(formName) == null) {
    formSheet = activeSheet.insertSheet();
    formSheet.setName(formName);
    isNewSheet = true;
  }
  return activeSheet.getSheetByName(formName);
}




function getSeetURL() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  return spreadsheet.getUrl();
}

function sendNotification(data, url) {
  var subject = "A new Elementor Pro forms submission has been inserted to your sheet";
  var message = "A new submission has been received via " + data['form_name'] + " form and inserted into your Google sheet at: " + url;
  MailApp.sendEmail(emailAddress, subject, message, {
    name: 'Automatic Emailer Script'
  });

}

//  contact editing setions

/**
* Gets a list of people in the user's contacts.
*/

// fuction that add contacts from spreadsheet
// magic function where it all happens
async function  insertToSheet(data) {
  var flat = flattenObject(data);
  var keys = Object.keys(flat);
  var formName = data["form_name"];
  var formSheet = getFormSheet(formName);
  var headers = getHeaders(formSheet, keys);
  var values = getValues(headers, flat);
  setHeaders(formSheet, headers);
  setValues(formSheet, values);
  if (emailNotification == "on") {
    sendNotification(data, getSeetURL());
  }
return true
}


const userContactGroup = () => {
  let currentGruop = getUserGruop()
  if (!currentGruop.includes(groupName)) {
    let newGruopName = createNewGruop(groupName)
    if (newGruopName.name == groupName) {
      return true
    } else {
      return false
    }
  } else {
    return true

  }

}



 const createContactSuccess = (details) => {
      let userInfo = JSON.parse(details)
      const { phoneNumbers, names, emailAddresses } = userInfo;
      var group = ContactsApp.getContactGroup(groupName);
        var contact = ContactsApp.createContact(`${names[0].familyName}`, `${names[0].givenName}`, `${emailAddresses[0].value}`);
        contact.addPhone(ContactsApp.Field.WORK_PHONE, `${phoneNumbers[0].value}`);
        group.addContact(contact) ;
        return console.log("contacatAdded");
    }

const addTocontact = (incoming) => {
  console.log(incoming)

     let useDetails = JSON.stringify({
            "phoneNumbers": [
              {
                "value": `${incoming[2]}`
              },
              {
                "canonicalForm": `${incoming[2]}`
              }

            ],
            "names": [
              {
                "givenName": `${incoming[1]}`,
                "familyName": `${incoming[5]}`,
              }
            ],
            "emailAddresses": [
              {
                "value": `${incoming[4]}`
              }
            ]
          })

    return createContactSuccess(`${useDetails}`); 

}



