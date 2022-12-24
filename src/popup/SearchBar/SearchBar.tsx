import React from "react"
import { InputBase, IconButton, Paper } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import { Box, Tooltip } from "@material-ui/core"

type Props = {
  tickerInput: string
  setTickerInput: React.Dispatch<React.SetStateAction<string>>
  handleTickerButtonClick: () => void
  handleTickerEnterClick: (event: React.KeyboardEvent<HTMLDivElement>) => void
}

const SearchBar: React.FC<Props> = ({
  tickerInput,
  setTickerInput,
  handleTickerButtonClick,
  handleTickerEnterClick,
}) => {
  return (
    <Paper>
      <Box px="15px" py="5px">
        <InputBase
          className="Search"
          placeholder="Add a symbol name"
          value={tickerInput}
          onChange={(event) => setTickerInput(event.target.value)}
          onKeyPress={handleTickerEnterClick}
        />
        <Tooltip title="Add symbol" arrow>
          <IconButton onClick={handleTickerButtonClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  )
}

export default SearchBar
