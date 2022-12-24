import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  CircularProgress,
  Button,
} from "@material-ui/core"
import { fetchTwelveDataData, TwelveDataData } from "../../utils/api"

type StockTableState = "loading" | "error" | "ready"

const TopMoversTableRow: React.FC<{
  ticker: string
  addButton: (ticker: string) => void
}> = ({ ticker, addButton }) => {
  const [topMoversData, setTopMoversData] = useState<TwelveDataData | null>(
    null
  )
  const [cardstate, setCardState] = useState<StockTableState>("loading")

  useEffect(() => {
    fetchTwelveDataData(ticker)
      .then((data) => {
        setTopMoversData(data)
        setCardState("ready")
        console.log("ready state reached")
      })
      .catch((err) => setCardState("error"))
  }, [])

  if (cardstate == "loading" || cardstate == "error") {
    return (
      <Box>
        {cardstate == "loading" && (
          <TableRow style={{ height: "70px" }}>
            <TableCell align="left">
              <Typography variant="body1">{ticker}</Typography>
            </TableCell>
            <TableCell align="left">
              <CircularProgress size={10} color={"inherit"} />
            </TableCell>
            <TableCell align="left">
              <CircularProgress size={10} color={"inherit"} />
            </TableCell>
            <TableCell align="left">
              <CircularProgress size={10} color={"inherit"} />
            </TableCell>
          </TableRow>
        )}
        <Typography variant="body1">
          {cardstate == "loading" ? (
            ""
          ) : (
            <TableRow style={{ height: "70px" }}>
              <TableCell>
                <Typography variant="body1">Error</Typography>
              </TableCell>
              <TableCell>
                <CircularProgress size={10} color={"inherit"} />
              </TableCell>
              <TableCell>
                <CircularProgress size={10} color={"inherit"} />
              </TableCell>
              <TableCell>
                <CircularProgress size={10} color={"inherit"} />
              </TableCell>
            </TableRow>
          )}
        </Typography>
      </Box>
    )
  }

  const deleteTrailingZeros = (rawPrice) => {
    var Price
    if (rawPrice < 1) {
      Price = rawPrice.toFixed(3)
    } else if (rawPrice >= 1 && rawPrice < 1000) {
      Price = rawPrice.toFixed(2)
    } else if (rawPrice >= 1000) {
      Price = rawPrice.toFixed(2)
    }

    return Price
  }

  const calculatePercentChange = (previousPrice, currentPrice) => {
    var percentChange = ((currentPrice - previousPrice) / previousPrice) * 100
    return percentChange.toFixed(2)
  }

  const calculateDollarChange = (previousPrice, currentPrice) => {
    var dollarChange = Math.abs(previousPrice - currentPrice)
    if (previousPrice > currentPrice) {
      return "-" + dollarChange.toFixed(2)
    } else {
      return "+" + dollarChange.toFixed(2)
    }
  }

  const colorCalculator = (percentChange) => {
    var color = ""
    if (percentChange > 0) {
      color = "rgb(51, 233, 39, 0.8)"
    }
    if (percentChange < 0) {
      color = "rgb(233, 53, 39, 0.8)"
    }
    return color
  }

  if (cardstate == "ready" && topMoversData.meta && topMoversData.values) {
    var currentPrice = parseFloat(topMoversData.values[0].close)
    var previousPrice = parseFloat(topMoversData.values[1].close)
    var symbolColor = colorCalculator(
      calculatePercentChange(previousPrice, currentPrice)
    )
    var fontStyle = {
      color: symbolColor,
    }

    return (
      <TableRow style={{ height: "70px" }}>
        <TableCell align="left">
          <Button color="inherit" onClick={() => addButton(ticker)}>
            <Typography variant="body1">{topMoversData.meta.symbol}</Typography>
          </Button>
        </TableCell>
        <TableCell align="left">
          <Typography variant="body1">
            ${deleteTrailingZeros(currentPrice)}
          </Typography>
        </TableCell>
        <TableCell style={fontStyle} align="left">
          <Typography variant="body2">
            {calculateDollarChange(previousPrice, currentPrice)}
          </Typography>
        </TableCell>
        <TableCell style={fontStyle} align="left">
          <Typography variant="body2">
            {"("}
            {calculatePercentChange(previousPrice, currentPrice)}
            {")"}%
          </Typography>
        </TableCell>
      </TableRow>
    )
  } else {
    return (
      <TableRow>
        <TableCell>Error</TableCell>
      </TableRow>
    )
  }
}

export default TopMoversTableRow
