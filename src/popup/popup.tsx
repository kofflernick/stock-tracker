import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { fetchTwelveDataData, TwelveDataData } from "../utils/api"
import {
  Box,
  Grid,
  InputBase,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core"
import { Add as AddIcon } from "@material-ui/icons"
import "fontsource-roboto"
import "./popup.css"
import StockCard from "./StockCard"
import { setStoredTickers, getStoredTickers } from "../utils/storage"

const App: React.FC<{}> = () => {
  const [tickers, setTickers] = useState<string[]>([])

  const [tickerInput, setTickerInput] = useState<string>("")

  useEffect(() => {
    getStoredTickers().then((tickers) => setTickers(tickers))
  }, [])

  /*table view stock going in here */
  // var inputArray = ["cvx", "aapl", "bbby", "amzn", "nflx"]
  // var array = []
  // useEffect(() => {
  //   for (var i = 0; i < inputArray.length; i++) {
  //     fetchTwelveDataData(inputArray[i]).then((data) => array.push(data))
  //   }
  //   console.log(array)
  // }, [])

  const handleTickerButtonClick = () => {
    if (tickerInput === "") {
      return
    }
    const updatedTickers = [...tickers, tickerInput]
    setStoredTickers(updatedTickers).then(() => {
      setTickers(updatedTickers)
      setTickerInput("")
    })
  }

  //this shows what is being put into the input bar AS you type it
  console.log(tickerInput)

  //function that will handle enter button for adding tickers
  const handleTickerEnterClick = (Event) => {
    if (tickerInput === "") {
      return
    } else if (Event.key === "Enter") {
      console.log("enter pressed")
      const updatedTickers = [...tickers, tickerInput]
      setStoredTickers(updatedTickers).then(() => {
        setTickers(updatedTickers)
        setTickerInput("")
      })
    }
  }

  const handleTickerDeleteButtonClick = (index: number) => {
    tickers.splice(index, 1)
    const updatedTickers = [...tickers]
    setStoredTickers(updatedTickers).then(() => {
      setTickers(updatedTickers)
    })
  }

  /*start of table view*/
  // if (tickers[0] == null) {
  // }

  return (
    <Box mx="8px" my="16px">
      <Box mx="8px" my="8px">
        <Grid container>
          <Grid item>
            <Paper>
              <Box px="15px" py="5px">
                <InputBase
                  className="Search"
                  placeholder="Add a symbol name"
                  value={tickerInput}
                  onChange={(event) => setTickerInput(event.target.value)}
                  onKeyDown={handleTickerEnterClick}
                />
                <IconButton onClick={handleTickerButtonClick}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {tickers.map((ticker, index) => (
        <StockCard
          ticker={ticker}
          key={index}
          onDelete={() => handleTickerDeleteButtonClick(index)}
        />
      ))}
      <Box height="16px" width="16px" />
    </Box>
  )
}

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.render(<App />, root)
