require("dotenv").config()
const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()

// basic middlewares !!
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Step 1 : do basic setup of connecting with mongodb and all
// Step2 : create schemas !!
// Step 3 : create routes for data collection
// Step 4 : create routes for data retrerival !!
// Step 5 : create authentication facility
// Step 6 : integrate authentication with these routes !!

// Handling the cors error
app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
)

// routes :

app.use("/user", require("./routes/user"))
app.use("/events", require("./routes/events"))

db.connect().then(() => {
  app.set("port", process.env.PORT || 5000)
  app.listen(app.get("port"), () => {
    console.log(`Server Started on http://localhost:${app.get("port")}`)
  })
})
