const MongoDB = require("./mongoService")

function DBService() {
    this.mongodb = new MongoDB()
}


module.exports = new DBService()