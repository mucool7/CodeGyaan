
module.exports ={

    lineSepertor:"@!!",
    lineTerminatorKeys :[";","{","}"],
    wordFormating : [

        {symbol:"{",deliminator:" @@{ ",replaceWith:" { ",operation:(penSetting)=>{ penSetting.isWrite=true;penSetting.isApplicableFromNextLine = true;penSetting.x+=10; penSetting.y+=16  }},
        {symbol:"}",deliminator:" @@} ",replaceWith:" } ",operation:(penSetting)=>{penSetting.isWrite=true;penSetting.isApplicableFromNextLine = false; penSetting.x-=10; penSetting.y+=16  }},
        {symbol:"/n",deliminator:" @@n ",replaceWith:"",operation:(penSetting)=>{  penSetting.isWrite=true;penSetting.isApplicableFromNextLine = false;penSetting.y+=16  }},
        {symbol:"/c/",deliminator:" @@/c/ ",replaceWith:"",operation:(penSetting)=>{  penSetting.isWrite=true;penSetting.isApplicableFromNextLine = true;penSetting.y+=16  }},
        {symbol:";",deliminator:" @@; ",replaceWith:";",operation:(penSetting)=>{  penSetting.isWrite=true;penSetting.isApplicableFromNextLine = true;penSetting.y+=16  }},

    ]

}