module.exports = function(app){

    var CodeGyaanController = require("../Controllers/CodeGyaan")

    app.route("/getAll").get(CodeGyaanController.getAllGyaan);
    app.route("/getDashboard").get(CodeGyaanController.getDashboardData);
    
    
}
