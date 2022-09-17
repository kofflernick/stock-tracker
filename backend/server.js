import * as dotenv from "dotenv"
import fetch from "node-fetch"
import express from "express"
import bodyParser from "body-parser"
import fs from "fs"
import { parse } from "csv-parse"
const app = express()
const port = process.env.PORT || 8000

fs.createReadStream("./static/test.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    console.log(row)
  })
  .on("error", function (error) {
    console.log(error.message)
  })
  .on("end", function () {
    console.log("finished")
  })

//Middlewares
app.use(bodyParser.json())
dotenv.config()

//routes
app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get("/twelve-data", async (req, res) => {
  const TWELVE_DATA_API_KEY = process.env.API_KEY
  const response = await fetch(
    `https://api.twelvedata.com/time_series?symbol=${req.query.ticker}&interval=1day&apikey=${TWELVE_DATA_API_KEY}`
  )

  const data = await response.json()

  res.json({ data })
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
