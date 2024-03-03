const mysql2 = require("mysql2")
require("dotenv").config();
    const database = mysql2.createConnection({
        user:"root",
        host:"localhost",
        database:"DevExchange",
        password:""
    })

    database.connect((error)=>{
        if(error)throw error
        console.log("database connected")

    })
    module.exports = database