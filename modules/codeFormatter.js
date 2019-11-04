
var config = require('./configurations')



module.exports ={

    getFormatedCode : function(code){
        return codeFormater(code)
    },
    wrapText : function(canvasContext,text,maxWidth){
                return wrapText(canvasContext,text,maxWidth)
    }
}

function codeFormater(rawCode){

    
    config.wordFormating.forEach(e=>{

        let regx = new RegExp(e.symbol,'g')
        rawCode = rawCode.replace(regx,e.deliminator)

    })
    
//console.log(rawCode)
    return rawCode

}

function wrapText(canvasContext,text,maxWidth){
    let line =""
    let words= text.split(' ')
    let h =""
    for(var n = 0; n < words.length; n++) {
      //  var testLine = line + words[n] + ' ';
        h= h+words[n] +" ";
        var metrics = canvasContext.measureText(h);
        var lineWidth = metrics.width;
       // console.log(line)
        if (lineWidth > maxWidth && n > 0) {
         
          line =line+ '/n ' + words[n]+' ';
           h=""+ words[n]+" ";

        }
        else {
          line = line+ words[n] +' ';
        }
      }
    //  console.log("######################## \n"+line)
     // console.log("######################## \n"+h)
    return line;  
}
