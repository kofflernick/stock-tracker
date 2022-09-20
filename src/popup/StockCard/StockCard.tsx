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
import { red } from "@material-ui/core/colors"
//import { ControlPointSharp } from "@material-ui/icons"

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
              : "Error: could not retrieve stock data for this symbol"}
          </Typography>
        </StockCardContainer>
      </Card>
    )
  }

  const deleteTrailingZeros = (rawPrice) => {
    var Price
    if (rawPrice < 1) {
      Price = rawPrice.toFixed(3)
    } else {
      Price = rawPrice.toFixed(2)
    }
    return Price
  }

  const calculatePercentChange = (openPrice, currentPrice) => {
    var percentChange = ((currentPrice - openPrice) / openPrice) * 100
    if (percentChange > 0) {
      return "+" + percentChange.toFixed(2)
    } else {
      return percentChange.toFixed(2)
    }
  }

  const colorCalculator = (openPrice, currentPrice) => {
    var color = ""
    var percentChange = ((currentPrice - openPrice) / openPrice) * 100
    if (percentChange > 0) {
      color = "rgb(51, 255, 51, 0.8)"
    }
    if (percentChange < 0) {
      color = "rgb(233, 53, 39, 0.8)"
    }
    return color
  }

  if (stockData.meta && stockData.values) {
    var symbolColor = colorCalculator(
      parseFloat(stockData.values[1].close),
      parseFloat(stockData.values[0].close)
    )

    var fontStyle = {
      color: symbolColor,
    }

    return (
      <Card style={cardStyle} className="Card">
        <StockCardContainer onDelete={onDelete}>
          <Typography variant="h5">{stockData.meta.symbol}</Typography>
          <Typography variant="body1">
            ${deleteTrailingZeros(parseFloat(stockData.values[0].close))}
          </Typography>
          <Typography style={fontStyle} variant="body1">
            {calculatePercentChange(
              parseFloat(stockData.values[1].close),
              parseFloat(stockData.values[0].close)
            )}
            %
          </Typography>
        </StockCardContainer>
      </Card>
    )
  } else {
    return (
      <Card style={cardStyle}>
        <StockCardContainer onDelete={onDelete}>
          <Typography variant="body1">
            Error: could not retrieve stock data for this symbol
          </Typography>
        </StockCardContainer>
      </Card>
    )
  }
}

export default StockCard
