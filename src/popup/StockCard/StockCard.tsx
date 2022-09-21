import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core"
import { fetchTwelveDataData, TwelveDataData } from "../../utils/api"
import "./StockCard.css"

var cardStyle = {
  display: "inline-block",
}

const StockCardContainer: React.FC<{
  children: React.ReactNode
  onDelete?: () => void
}> = ({ children, onDelete }) => {
  return (
    <Box mx={"14px"} my={"16px"}>
      <Card style={cardStyle}>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && (
            <Button color="secondary" onClick={onDelete}>
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  )
}

type StockCardState = "loading" | "error" | "ready"

const StockCard: React.FC<{
  ticker: string
  onDelete?: () => void
}> = ({ ticker, onDelete }) => {
  const [stockData, setStockData] = useState<TwelveDataData | null>(null)
  const [cardstate, setCardState] = useState<StockCardState>("loading")

  useEffect(() => {
    fetchTwelveDataData(ticker)
      .then((data) => {
        setStockData(data)
        setCardState("ready")
      })
      .catch((err) => setCardState("error"))
  }, [ticker])

  if (cardstate == "loading" || cardstate == "error") {
    return (
      <Card style={cardStyle}>
        <StockCardContainer onDelete={onDelete}>
          <Typography variant="body1">
            {cardstate == "loading"
              ? "Loading..."
              : "Error: Could not retrieve stock data for this symbol \n please check your connection."}
          </Typography>
        </StockCardContainer>
      </Card>
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

  if (stockData.meta && stockData.values) {
    var currentPrice = parseFloat(stockData.values[0].close)
    var previousPrice = parseFloat(stockData.values[1].close)
    var symbolColor = colorCalculator(
      calculatePercentChange(previousPrice, currentPrice)
    )
    var fontStyle = {
      color: symbolColor,
    }

    return (
      <Card style={cardStyle} className="Card">
        <StockCardContainer onDelete={onDelete}>
          <Typography variant="h5">{stockData.meta.symbol}</Typography>
          <Typography variant="body1">
            ${deleteTrailingZeros(currentPrice)}
          </Typography>
          <Typography style={fontStyle} variant="body1">
            {calculateDollarChange(previousPrice, currentPrice)}
          </Typography>
          <Typography style={fontStyle} variant="body2">
            {"("}
            {calculatePercentChange(previousPrice, currentPrice)}
            {")"}%
          </Typography>
        </StockCardContainer>
      </Card>
    )
  } else {
    return (
      <Card style={cardStyle}>
        <StockCardContainer onDelete={onDelete}>
          <Typography variant="body1">
            Error: Could not retrieve stock data for this symbol.
          </Typography>
        </StockCardContainer>
      </Card>
    )
  }
}

export default StockCard
