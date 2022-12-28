import * as dotenv from "dotenv"
import fetch from "node-fetch"
import express from "express"
import bodyParser from "body-parser"
import fs from "fs"
import { parse } from "csv-parse"
import PriorityQueue from "priorityqueue"
import BinaryHeap from "priorityqueue/BinaryHeap"
const app = express()
const port = process.env.PORT || 8000

//Middlewares
app.use(bodyParser.json())
dotenv.config()

const serverUrl = process.env.SERVER_URL

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
