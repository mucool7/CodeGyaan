
const Content = require("../modules/googleSheets")

exports.getAllGyaan = function(req,res){

    Content.getAllData(data=>{
        res.json(data);
        res.end(data);
    })

}

exports.getDashboardData = (req,res)=>{

    Content.getDashboardData(data=>{
        res.json(data);
        res.end(data);
    })
}