process.env.PWD = process.cwd()
var http = require('http');
var express = require("express")
var file = require('fs');
var mailer = require('./modules/SendingMail')
var drawImage = require("./modules/imageDraw");
const readline = require('readline');
var sheet= require('./modules/googleSheets')
var saveImage = require('./modules/SaveImage')
var basePath ="pb/imgKnowledge"
 //var endPoint="http://52.66.240.183/"
var endPoint="http://localhost:9000/"
var router = require('./Routes/api-route')
var cors = require('cors')


var app = new express();


app.use(cors());
app.use(express.static(process.env.PWD));
router(app)
app.get('/', function (req, res){


  console.log(req.url)
  if (req.url == '/') 
  sheet.GetSheetData((rows)=>{

    setTimeout(()=>{
         
      res.writeHead(200, {'Content-Type': 'text/html'});

     //  setInterval(() => {
     //   mailer.SendMail('mukul.singh@infobeans.com',generateHtml())
     //  }, 10000);
      drawImage.getImage(rows,base64=>{
        
        saveImg(base64,(path)=>{

          SendMail(path);
          res.end(generateHtml(path))


        })
       

      })
      
   },2000)

  
  })
  else{
    res.end(req.url)
  }


} )


app.listen(9000, function () {
  console.log('Example app listening on port 3000!');
});



function generateHtml(path){
 
  let html =`
      <img src="`+endPoint+path+`"> </br> </code>
  `
  return html;
}

function SendMail(path){

  
  sheet.GetEmailIDs(emails=>{
    if(!emails) return console.log("No emails found")
    emails=emails.map(x=>x[0]).join(',')
    console.log(emails)
    mailer.SendMail(emails,generateHtml(path))
  })


}

function saveImg(base64,callback){

  let path = basePath+'/im'+(Math.random()*300)+'.png'
  saveImage.saveImageToFile(path,base64);
  callback(path)
}


