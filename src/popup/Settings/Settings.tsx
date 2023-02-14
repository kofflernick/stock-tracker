import React from "react"
import { InputBase, IconButton, Paper } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import { Box, Tooltip, Typography, Grid } from "@material-ui/core"

const Settings: React.FC<{}> = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Box mx="8px" my="160px">
        <Grid container justifyContent="center" alignItems="center">
          <Typography variant="h5" className="background-text-color">
            Settings page coming soon
          </Typography>
        </Grid>
      </Box>
    </Box>
  )
}

export default Settings
