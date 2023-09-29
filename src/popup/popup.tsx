import React, { useEffect, useState, useRef } from "react"
import ReactDOM from "react-dom"
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
  Button,
  Tooltip,
  TextField,
  Badge,
  ClickAwayListener,
} from "@material-ui/core"
import AutoGraphSharpIcon from "@mui/icons-material/AutoGraphSharp"
import SettingsIcon from "@mui/icons-material/Settings"
import AppsIcon from "@mui/icons-material/Apps"
import "fontsource-roboto"
import "./popup.css"
import StockCard from "./StockCard"
import {
  setStoredTickers,
  getStoredTickers,
  setStoredFavTickers,
  getStoredFavTickers,
} from "../utils/storage"
import SearchBar from "./SearchBar"
import TopMoversTableRow from "./TopMoversTableRow"
import Settings from "./Settings"
import { height } from "@mui/system"
import Favorites from "./Favorites"

const App: React.FC<{}> = () => {
  const [tickers, setTickers] = useState<string[]>([])

  const [favTickers, setFavTickers] = useState<string[]>([])

  const [tickerInput, setTickerInput] = useState<string>("")

  const [showTable, setShowTable] = useState(false)

  const [showSettings, setShowSettings] = useState(false)

  const [showCards, setShowCards] = useState(true)

  const [invisible, setInvisible] = useState(true)

  const [badgeCount, setBadgeCount] = useState(0)

  const appsIconRef = useRef<HTMLDivElement>(null)

  const [shake, setShake] = useState(false)

  const [attemptedDuplicate, setAttemtpedDuplicate] = useState(false)

  useEffect(() => {
    getStoredTickers().then((tickers) => setTickers(tickers))
  }, [])

  useEffect(() => {
    getStoredFavTickers().then((favTickers) => setFavTickers(favTickers))
  }, [])

  useEffect(() => {
    setStoredFavTickers(favTickers)
  }, [favTickers])

  // function to add tickers from the favorites page back to the tile view
  const addFavoriteToTickers = (ticker: string) => {
    if (tickers.includes(ticker.toUpperCase())) {
      appsIconRef.current.classList.add("shake-animation")
      setTimeout(() => {
        appsIconRef.current.classList.remove("shake-animation")
      }, 1000)
      setTickerInput("")
      setShake(true)
      return
    } else {
      const updatedTickers = [...tickers, ticker.toUpperCase()]
      setStoredTickers(updatedTickers).then(() => {
        setTickers(updatedTickers)
      })
    }
    if (invisible == true) {
      setInvisible(!invisible)
    }
    setBadgeCount(badgeCount + 1)
  }

  // function to clear the favorites array
  const clearFavorites = () => {
    setFavTickers([])
  }

  // Function to add a ticker to favorites
  const addTickerToFavorites = (ticker: string) => {
    if (favTickers.includes(ticker.toUpperCase())) {
      appsIconRef.current.classList.add("shake-animation")
      setTimeout(() => {
        appsIconRef.current.classList.remove("shake-animation")
      }, 1000)
      setTickerInput("")
      setShake(true)
      return
    } else {
      const updatedFavTickers = [...favTickers, ticker.toUpperCase()]
      setFavTickers(updatedFavTickers)
    }
    console.log(favTickers)
  }

  /* functions of the search bar that handle an input from the user.
  upon clicking the add button or pressing enter a stock card is 
  made in tile view for the ticker and the user is automatically 
  taken to stock tile view. If a duplicate ticker is attempted to be added 
  a shaking animation is added to the search bar and tickers is not
  updated */

  const handleTickerButtonClick = () => {
    if (tickerInput === "" || tickers.includes(tickerInput.toUpperCase())) {
      appsIconRef.current.classList.add("shake-animation")
      setTimeout(() => {
        appsIconRef.current.classList.remove("shake-animation")
      }, 1000)
      setTickerInput("")
      setShake(true)
      return
    } else if (tickerInput !== "") {
      console.log(tickerInput)
      const updatedTickers = [...tickers, tickerInput.toUpperCase()]
      setStoredTickers(updatedTickers).then(() => {
        setTickers(updatedTickers)
        setTickerInput("")
      })
      handleAppsIconButtonClick()
    }
    console.log(tickers)
  }

  const handleTickerEnterClick = (Event) => {
    if (Event.key === "Enter" && tickers.includes(tickerInput.toUpperCase())) {
      appsIconRef.current.classList.add("shake-animation")
      setTimeout(() => {
        appsIconRef.current.classList.remove("shake-animation")
      }, 1000)
      setTickerInput("")
      setShake(true)
      return
    } else if (Event.key === "Enter" && tickerInput !== "") {
      console.log(tickerInput)
      const updatedTickers = [...tickers, tickerInput.toUpperCase()]
      setStoredTickers(updatedTickers).then(() => {
        setTickers(updatedTickers)
        setTickerInput("")
      })
      handleAppsIconButtonClick()
    }
    console.log(tickers)
  }

  /* add tickers from the top movers table to
  the stock tiles page and delete tickers from the stock tiles page */

  const handleTopMoversAddButtonClick = (ticker: string) => {
    if (tickers.includes(ticker)) {
      appsIconRef.current.classList.add("shake-animation-topMover")
      setTimeout(() => {
        appsIconRef.current.classList.remove("shake-animation-topMover")
      }, 1000)
      return
    }
    const updatedTickers = [...tickers, ticker]
    setStoredTickers(updatedTickers).then(() => {
      setTickers(updatedTickers)
    })
    if (invisible == true) {
      setInvisible(!invisible)
    }
    setBadgeCount(badgeCount + 1)
  }

  const handleTickerDeleteButtonClick = (index: number) => {
    tickers.splice(index, 1)
    const updatedTickers = [...tickers]
    setStoredTickers(updatedTickers).then(() => {
      setTickers(updatedTickers)
    })
  }

  /* three functions that toggle between stock tile view,
  top movers view, and the settings page. top movers and stock tile
  share a button that changes icon*/

  const handleAutoGraphSharpIconButtonClick = () => {
    if (showCards == true && showSettings == false) {
      setShowCards(!showCards)
      setShowTable(!showTable)
    } else if (showCards == false && showSettings == true) {
      setShowSettings(!showSettings)
      setShowTable(!showTable)
    }
    setInvisible(!invisible)
  }

  const handleAppsIconButtonClick = () => {
    if (showTable == true && showSettings == false) {
      setShowTable(!showTable)
      setShowCards(!showCards)
    } else if (showTable == false && showSettings == true) {
      setShowSettings(!showSettings)
      setShowCards(!showCards)
    }
    setBadgeCount(0)
  }

  const handleSettingsIconButtonClick = () => {
    if (showCards == true && showTable == false) {
      setShowCards(!showCards)
      setShowSettings(!showSettings)
    } else if (showCards == false && showTable == true) {
      setShowTable(!showTable)
      setShowSettings(!showSettings)
    }
  }

  if (showTable == true) {
    return (
      <Box mx="8px" my="16px">
        <Box mx="8px" my="8px">
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <SearchBar
                tickerInput={tickerInput}
                setTickerInput={setTickerInput}
                handleTickerButtonClick={handleTickerButtonClick}
                handleTickerEnterClick={handleTickerEnterClick}
              />
            </Grid>
            <Grid item ref={appsIconRef}>
              <Tooltip title="Tracker Window" arrow>
                <IconButton onClick={handleAppsIconButtonClick}>
                  {badgeCount > 0 && (
                    <Badge badgeContent={badgeCount} color="secondary">
                      <AppsIcon />
                    </Badge>
                  )}
                  {badgeCount === 0 && <AppsIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Settings" arrow>
                <IconButton onClick={handleSettingsIconButtonClick}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid item>
            <Favorites
              favTickers={favTickers}
              addFavorite={addFavoriteToTickers}
              clearFavorites={clearFavorites}
            />
          </Grid>
        </Box>
        <Box height="46px" width="16px" />
      </Box>
    )
  } else if (showCards == true) {
    return (
      <Box mx="8px" my="16px">
        <Box mx="8px" my="8px">
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <SearchBar
                tickerInput={tickerInput}
                setTickerInput={setTickerInput}
                handleTickerButtonClick={handleTickerButtonClick}
                handleTickerEnterClick={handleTickerEnterClick}
              />
            </Grid>
            <Grid item>
              <Tooltip title="Favorites" arrow>
                <IconButton onClick={handleAutoGraphSharpIconButtonClick}>
                  <AutoGraphSharpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Settings" arrow>
                <IconButton onClick={handleSettingsIconButtonClick}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
        {tickers.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Box mx="8px" my="160px">
              <Grid container justifyContent="center" alignItems="center">
                <Typography variant="h5" className="background-text-color">
                  No stocks added yet
                </Typography>
              </Grid>
            </Box>
          </Box>
        ) : (
          <div ref={appsIconRef}>
            <Grid item style={{ marginLeft: "8px" }}>
              {tickers.map((ticker, index) => (
                <StockCard
                  ticker={ticker}
                  key={index}
                  onDelete={() => handleTickerDeleteButtonClick(index)}
                  addTickerToFavorites={addTickerToFavorites}
                />
              ))}
            </Grid>
          </div>
        )}
        <Box height="10px" width="16px" />
      </Box>
    )
  } else if (showSettings == true) {
    return (
      <Box mx="8px" my="16px">
        <Box mx="8px" my="8px">
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <SearchBar
                tickerInput={tickerInput}
                setTickerInput={setTickerInput}
                handleTickerButtonClick={handleTickerButtonClick}
                handleTickerEnterClick={handleTickerEnterClick}
              />
            </Grid>
            <Grid item>
              <Tooltip title="Favorites" arrow>
                <IconButton onClick={handleAutoGraphSharpIconButtonClick}>
                  <AutoGraphSharpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Settings" arrow>
                <IconButton onClick={handleSettingsIconButtonClick}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
        <Grid item>
          <Settings />
        </Grid>
        <Box height="16px" width="16px" />
      </Box>
    )
  }
}

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.render(<App />, root)
