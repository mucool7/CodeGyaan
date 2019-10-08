const { createCanvas, loadImage } = require('canvas')

var canvas ;
var ctx ;//= canvas.getContext('2d');
var unitBlockWidth ;
var unitBlockHeight;
var characterWidth;
//var sheetID ='10uFJN_3ZtZkSow9GQNiaU_JAdL_6SQDAQPlTAkl5BaA'//'1I2mIbtW0elDUNQSbWExq-wa8uw4fic1IjKVFXtTjj_M'
var backgroundColor="#65C4EC"

const Data={

    block:2,
    characters:2,
    annotaions:``,



}

var finalData = new Array();;

module.exports={

    getImage:function(initData,callback){


        InitilizeData(initData);
        Init(()=>{

            createBlocks(()=>{
                callback(canvas.toDataURL());
            });

        })
     



    }
}


   
function InitilizeData(rows){
    Data.block =rows[1]
    Data.characters =rows[2]
    Data.annotaions =rows[3]

}

function Init(callback){
    let Unitheight = 350;
    let ActualHeight = Unitheight*Math.ceil(Data.block/2)
     unitBlockWidth = 600;
     unitBlockHeight = 350;
     characterWidth=220;

    canvas = createCanvas(unitBlockWidth*2+10, ActualHeight)
    ctx = canvas.getContext('2d')

   
    finalData = new Array();;
    Data.annotaions.split("b^:").forEach(ele=>{


       if(ele)
       finalData.push({
           c1:ele.split('c:')[1],
           c2:ele.split('c:')[2]

       })

    })
    generateColor();
   // console.log( finalData)

    callback();
}

function createBlocks(callback){

   ctx.beginPath();
  
   
   var x=0;
   var y=0;
   let blockseperation =2;
   let columnNo =1;

   

   function drawBlocks(callback){

      

       for(let b=1;b<=Data.block;b++){

           
           ctx.beginPath();
           ctx.fillStyle=backgroundColor
           ctx.fillRect(x,y,unitBlockWidth,unitBlockHeight)
           ctx.rect(x,y,unitBlockWidth,unitBlockHeight)
           ctx.strokeStyle="#bfbfbf";
           ctx.stroke();
           

           createCharacters(x,y,unitBlockWidth,unitBlockHeight,columnNo);
           createAnnotations(x,y,unitBlockWidth,unitBlockHeight,columnNo,b);
       

           
           if(x >= unitBlockWidth){

              // console.log(x,"inn")
               x=0
               y+=(unitBlockHeight+blockseperation);
               
          // console.log(x,y)
           }
           else
           x += (unitBlockWidth+blockseperation);

           columnNo++;
       }

       
     setTimeout(()=>{
        callback();
     },2000)
   }

   drawBlocks(callback);
}

function createCharacters(x,y,width,height,columnNo){


   let x1,y1,width1,height1;
    x1=(x)+(unitBlockWidth/2)-(characterWidth+20)
    y1= y+(height/2+50)-2;
    width1=characterWidth,
    height1=height/2-50;


   loadImage('img/panda.png').then((image) => {
       ctx.beginPath()
       ctx.drawImage(image, x1, y1, width1, height1)

       
   x1=(x)+(unitBlockWidth/2)+20
    
   loadImage('img/shifu.png').then((image) => {
       ctx.beginPath()
       ctx.drawImage(image, x1, y1, width1, height1)
     
    
     })
     
    
     })

    
}




function createAnnotations(x,y,width,height,columnNo,blockNo){



   
   let x1,y1,width1,height1;
    x1=(x)+(unitBlockWidth/2)-(characterWidth+ 10)
    y1= y+4;
    width1=unitBlockWidth/2;
    height1=height/2+50;

  

    ctx.fillStyle="white"
   // Creating first colud bubble
   if(finalData[blockNo-1]["c1"])
   loadImage('img/cloud2.png').then((image) => {
      
       if(finalData[blockNo-1]["c1"])
       {
         if(!finalData[blockNo-1]["c2"])
             width1= (width1*2)-20
         else
             width1= (width1)-20

         ctx.beginPath()
         ctx.drawImage(image, x1-70, y1, (width1)-20, height1)
         ctx.beginPath()
         ctx.fillStyle="#202020"
         ctx.font="14px sans-serif"
         wrapText(finalData[blockNo-1].c1,x1-50,y1+30,width1-50,20)
     }

       
   x1=(x)+(unitBlockWidth/2)+20
    
   // Creating second colud bubble
   if(finalData[blockNo-1]["c2"])
   loadImage('img/cloud.png').then((image) => {

     width1=unitBlockWidth/2
       if(!finalData[blockNo-1]["c1"])
         width1= (width1*2)
         
       else
         width1= (width1)

         ctx.beginPath()
         ctx.drawImage(image, x1, y1, width1-30, height1)
         ctx.beginPath()
         ctx.fillStyle="#202020"
         ctx.font="14px sans-serif"
       //  ctx.fillText(finalData[blockNo-1].c2,x1+20,y1+30)
         wrapText(finalData[blockNo-1].c2,x1+20,y1+30,width1-60,20)
       
     
     })
     
    
   })


}

function wrapText( text, x, y, maxWidth, lineHeight) {

 let context = ctx;
 var words = text.split(' ');
 var line = '';

// console.log(maxWidth)
 for(var n = 0; n < words.length; n++) {
   var testLine = line + words[n] + ' ';
   var metrics = context.measureText(testLine);
   var testWidth = metrics.width;
   //console.log('word Width',testWidth)
   if (testWidth > maxWidth && n > 0) {
     context.fillText(line, x, y);
     line = words[n] + ' ';
     y += lineHeight;
   }
   else {
     line = testLine;
   }
 }
 context.fillText(line, x, y);
}

function generateColor(){
 let R=Math.ceil( Math.random()*255)
 let G=Math.ceil(Math.random()*255)
 let B=Math.ceil(Math.random()*255)

 backgroundColor = 'rgba('+R+','+G+','+B+',0.5)'
}

