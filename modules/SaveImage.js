
var fs = require("fs");

module.exports = {

    saveImageToFile : function(ImagePath,base64Data){

        fs.writeFile(ImagePath,base64Data.replace(/^data:image\/png;base64,/, ""),"base64",()=>{});
        console.log("File saved",ImagePath)

    }

}
