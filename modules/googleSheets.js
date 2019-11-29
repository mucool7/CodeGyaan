
const {google} = require('googleapis');
const fs = require('fs');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const readline = require('readline');
const config = require('./configurations')
//const ContentModel = require("../Models/ContentModels")
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
var sheetID ='10uFJN_3ZtZkSow9GQNiaU_JAdL_6SQDAQPlTAkl5BaA'//'1I2mIbtW0elDUNQSbWExq-wa8uw4fic1IjKVFXtTjj_M'
var backgroundColor="#65C4EC"
var selectedRowIndex =0;
var emailSheetID ="Subscribers"
module.exports = {

   GetSheetData: function(callback){

       loadSheet(callback);

   }  ,

   GetEmailIDs:function(callback){

      onSheetsAuthentication(authToken=>{

        //console.log(authToken)
      const sheets = google.sheets({version: 'v4', auth:authToken});
      sheets.spreadsheets.values.get({
        spreadsheetId: config.SheetID,
        range: config.SheetNames.Subscribers+'!A1:A10',
      }, (err, res) => {
      if (err) return console.log('The API returned an error on reading emails: ' + err);


      //console.log(res.data)
      callback(res.data.values);


  });


      })


   },

   getAllData:function(Callback){

    onSheetsAuthentication(authToken=>{
      const sheet = google.sheets({version:"v4",auth:authToken});

      sheet.spreadsheets.values.get({
        spreadsheetId:config.SheetID,
        range:config.SheetNames.Content+"!A1:Z100"

      },(err,res)=>{
        if(err){ return console.log(err.message)};

        // finding columns
       // console.log(JSON.stringify(res.data))
        let cols={};
        res.data.values[0].forEach((e,i)=>{

          cols[""+e+""]=i;
        })
        
        let Contents = [];

        res.data.values.filter((x,i)=>i>0).forEach(contetRow=>{

          let cont = {};
          cont.Content = contetRow[cols["Annotations"]];
          cont.CreateBy =contetRow[cols["Created By"]]
          cont.CreateOn =contetRow[cols["Timestamp"]]
          cont.Blocks =contetRow[cols["Blocks"]]

          Contents.push(cont);

        })


        Callback(Contents);

      })
    })


   },

   getDashboardData:function(callback){

     onSheetsAuthentication(authToken=>{

        const sheet = google.sheets({version:"v4",auth:authToken});

        sheet.spreadsheets.values.batchGet({
          spreadsheetId:config.SheetID,
          ranges:[

            config.SheetNames.Content+"!A1:Z1000",
            config.SheetNames.Users+"!A1:Z1000",
            config.SheetNames.Subscribers+"!A1:Z1000"
         
        ]},(err,res)=>{

          if(err){ return console.log(err.message)}

         // console.log(res.data.valueRanges);

         // callback(res.data.valueRanges)
         let data = res.data.valueRanges;
          let cols={
            content:{},
            users:{},
            subscribers:{}
          };
          data[0].values[0].forEach((e,i)=>{
  
            cols.content[""+e+""]=i;
          })

          data[1].values[0].forEach((e,i)=>{
  
            cols.users[""+e+""]=i;
          })

          data[2].values[0].forEach((e,i)=>{
  
            cols.subscribers[""+e+""]=i;
          })


          let dashboardData ={
            Tiles:{ 
              users:data[1].values.length-1,
              contentL:data[0].values.filter(x=>x[cols.content["Sent"]]=="1").length,
              contentT:data[0].values.length },
            TopUsers: data[1].values.filter((x,i)=>i>0).map(x=> 
              { 
                
                console.log(cols)
                let ob  = {};
                ob["user"] = x[cols.users["Name"]];
                ob.posts = data[0].values.filter((y,ii)=>y[cols.content["Created By"]]==x[cols.users["Id"]] && ii>0).length; 
                return ob;
              }) ,
            TodayPost:{
              title:null,
              createdBy:null,
              content:null
            }
          }

          callback(dashboardData)



        })

     })
   }

   
}

function onSheetsAuthentication(callback){
  
  // Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), callback);
});

}



// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), getDataFromSheet);
});


function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}


function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        //console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1I2mIbtW0elDUNQSbWExq-wa8uw4fic1IjKVFXtTjj_M/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getDataFromSheet(auth,callback) {

    //console.log(auth)

    selectedRowIndex = 0;
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range: 'DataSet!A1:F500',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);

     rows = res.data.values;
    console.log(rows)
     rows = rows.filter((x,i)=>{
       
       if((x[4]=='0' || !x[4])&&i>0){
        if(!selectedRowIndex)
        selectedRowIndex = i+1;

        return true;
       }
      })[0]
     //console.log(rows)

     if(!rows) return console.log('No Values found')
    //  Data.block =rows[1]
    //  Data.characters =rows[2]
    //  Data.annotaions =rows[3]

     updateSheet(auth)

     if(callback)
     callback(rows);

  });
}

function updateSheet(auth){
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.update({
    spreadsheetId:sheetID,
    range:'DataSet!E'+selectedRowIndex,
    valueInputOption:'USER_ENTERED',
    resource:{
      values:[["1"]]

    }
    
  },function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(selectedRowIndex)
    // TODO: Change code below to process the `response` object:
 //   console.log(JSON.stringify(response, null, 2));
  })
}

function loadSheet(callback){

    
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    // authorize(JSON.parse(content), getDataFromSheet);

    let credentials= JSON.parse(content)
    const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, getDataFromSheet);
    oAuth2Client.setCredentials(JSON.parse(token));
    getDataFromSheet(oAuth2Client,callback);
  });
  });


}