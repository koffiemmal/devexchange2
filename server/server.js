const express = require("express")
const database = require("../server/config/mysql")
const cors = require("cors")
const userRoute = require('../server/Routes/userRoutes')
const app = express()

app.use(cors())
app.use(express.json())


app.use("/user",userRoute)
app.listen(5000)