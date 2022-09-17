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

const StockCardContainer: React.FC<{
  children: React.ReactNode
  onDelete?: () => void
}> = ({ children, onDelete }) => {
  return (
    <Box mx={"4px"} my={"16px"}>
      <Card>
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
      <StockCardContainer onDelete={onDelete}>
        <Typography variant="body1">
          {cardstate == "loading"
            ? "Loading..."
            : "Error: could not retrieve stock data for this symbol"}
        </Typography>
      </StockCardContainer>
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
    return percentChange.toFixed(2)
  }

  if (stockData.meta && stockData.values) {
    return (
      <StockCardContainer onDelete={onDelete}>
        <Typography variant="h5">{stockData.meta.symbol}</Typography>
        <Typography variant="body1">
          Price: ${deleteTrailingZeros(parseFloat(stockData.values[0].close))}
        </Typography>
        <Typography variant="body1">
          Change:{" "}
          {calculatePercentChange(
            parseFloat(stockData.values[1].close),
            parseFloat(stockData.values[0].close)
          )}
          %
        </Typography>
      </StockCardContainer>
    )
  } else {
    return (
      <StockCardContainer onDelete={onDelete}>
        <Typography variant="body1">
          Error: could not retrieve stock data for this symbol
        </Typography>
      </StockCardContainer>
    )
  }
}

export default StockCard