import React from "react"
import { Box, Button, makeStyles, Grid } from "@material-ui/core"
import DeleteIcon from "@mui/icons-material/Delete"

interface FavoritesProps {
  favTickers: string[]
  addFavorite: (ticker: string) => void
  clearFavorites: () => void
}

const useStyles = makeStyles((theme) => ({
  button: {
    width: "80px",
    height: "40px",
    marginRight: "8px",
    marginBottom: "8px",
  },
  clearButton: {
    width: "10px",
    position: "fixed",
    bottom: "10px",
  },
}))

const Favorites: React.FC<FavoritesProps> = ({
  favTickers,
  addFavorite,
  clearFavorites,
}) => {
  const classes = useStyles()

  return (
    <Box>
      <Box>
        <Grid item style={{ marginLeft: "8px" }}>
          {favTickers.map((ticker, index) => (
            <Button
              key={index}
              className={classes.button}
              variant="outlined"
              onClick={() => addFavorite(ticker)}
            >
              {ticker}
            </Button>
          ))}
        </Grid>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        marginLeft={"7px"}
      >
        <Button
          className={classes.clearButton}
          variant="outlined"
          color="secondary"
          onClick={clearFavorites}
        >
          <DeleteIcon />
        </Button>
      </Box>
    </Box>
  )
}

export default Favorites
