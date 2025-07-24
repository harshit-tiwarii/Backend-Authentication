const mongoos = require('mongoose')
const MONGO_DB_URL = process.env.MONGO_DB_URL || "localhost:27017/practice";

const databaseconnect = ()=>{
    mongoos
        .connect(MONGO_DB_URL)
        .then((conn)=> console.log("connected to DB"))
        .catch((err)=> console.log(err.message))
}
module.exports = databaseconnect