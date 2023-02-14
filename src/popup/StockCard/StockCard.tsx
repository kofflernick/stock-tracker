import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  LinearProgress,
  CircularProgress,
  IconButton,
  ClickAwayListener,
  styled,
} from "@material-ui/core"
import { Draggable } from "react-beautiful-dnd"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import EqualizerIcon from "@mui/icons-material/Equalizer"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import { fetchTwelveDataData, TwelveDataData } from "../../utils/api"
import "./StockCard.css"

var cardStyle = {
  display: "inline-block",
}

const StockCardContainer: React.FC<{
  children: React.ReactNode
  onDelete?: () => void
}> = ({ children, onDelete }) => {
  const [open, setOpen] = React.useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "inherit",
      color: "rgba(255, 255, 255, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }))

  return (
    <Box
      mx={"14px"}
      my={"16px"}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Card
        style={{ position: "relative", ...cardStyle }}
        className="InnerCardLoading"
      >
        <CardActions>
          {onDelete && (
            <IconButton
              style={{
                position: "absolute",
                top: "-2px",
                left: "-2px",
                transform: "scale(0.6)",
                borderRadius: 5,
                width: "10px",
                height: "10px",
              }}
              onClick={onDelete}
            >
              <CloseRoundedIcon />
            </IconButton>
          )}
        </CardActions>
        <CardContent>{children}</CardContent>
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
  const [open, setOpen] = React.useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f5",
      color: "rgba(0, 0, 0, 0.87)",
      width: 220,
      height: 200,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }))

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
      <Card style={cardStyle} className="Card">
        <StockCardContainer onDelete={onDelete}>
          <Typography variant="h5">{ticker}</Typography>
          <Box my="48px">
            {cardstate == "loading" && <LinearProgress color="secondary" />}
            <Typography variant="body1">
              {cardstate == "loading" ? "" : "Error: \nConnection"}
            </Typography>
          </Box>
          <HtmlTooltip
            onClose={handleTooltipClose}
            open={open}
            disableFocusListener
            disableTouchListener
            title={
              <React.Fragment>
                <CircularProgress size={10} color={"inherit"} />
              </React.Fragment>
            }
            arrow
          >
            <IconButton
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                transform: "scale(0.6)",
                borderRadius: 5,
                width: "10px",
                height: "10px",
              }}
              onClick={handleTooltipOpen}
            >
              <EqualizerIcon />
            </IconButton>
          </HtmlTooltip>
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

  if (cardstate == "ready" && stockData.meta && stockData.values) {
    var currentPrice = parseFloat(stockData.values[0].close)
    var previousPrice = parseFloat(stockData.values[1].close)
    var symbolColor = colorCalculator(
      calculatePercentChange(previousPrice, currentPrice)
    )
    var fontStyle = {
      color: symbolColor,
    }

    const chartData = []

    for (let i = 0; i < stockData.values.length; i++) {
      const { datetime, close } = stockData.values[i]
      chartData.push({
        date: datetime,
        price: deleteTrailingZeros(parseFloat(close)),
      })
    }
    chartData.reverse()

    const minPrice = Math.min(...chartData.map((d) => d.price))
    const maxPrice = Math.max(...chartData.map((d) => d.price))

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
          <HtmlTooltip
            onClose={handleTooltipClose}
            open={open}
            disableFocusListener
            disableTouchListener
            title={
              <React.Fragment>
                <Typography color="inherit" variant="body2">
                  {ticker}
                </Typography>
                <ResponsiveContainer>
                  <BarChart width={200} height={200} data={chartData}>
                    <YAxis domain={[minPrice, maxPrice]} />
                    <XAxis
                      tick={false}
                      dataKey="date"
                      tickCount={chartData.length}
                    />
                    <Bar dataKey="price" />
                  </BarChart>
                </ResponsiveContainer>
              </React.Fragment>
            }
          >
            <IconButton
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                transform: "scale(0.6)",
                borderRadius: 5,
                width: "10px",
                height: "10px",
              }}
              onClick={handleTooltipOpen}
            >
              <EqualizerIcon />
            </IconButton>
          </HtmlTooltip>
        </StockCardContainer>
      </Card>
    )
  } else {
    return (
      <Card style={cardStyle} className="Card">
        <StockCardContainer onDelete={onDelete}>
          <Box my="38px">
            <Typography variant="body1">Error</Typography>
            <HtmlTooltip
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableTouchListener
              title={
                <React.Fragment>
                  <CircularProgress size={10} color={"inherit"} />
                </React.Fragment>
              }
              arrow
            >
              <IconButton
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  right: "-2px",
                  transform: "scale(0.6)",
                  borderRadius: 5,
                  width: "10px",
                  height: "10px",
                }}
                onClick={handleTooltipOpen}
              >
                <EqualizerIcon />
              </IconButton>
            </HtmlTooltip>
          </Box>
        </StockCardContainer>
      </Card>
    )
  }
}

export default StockCard
