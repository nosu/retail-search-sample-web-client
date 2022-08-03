import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, DialogContentText } from "@mui/material"
import { useContext, useState } from "react"
import { ConfigContext } from "./_app"

type ConfigDialogProps = {
  isConfigDialogOpen: boolean
  closeConfigDialog: () => any
}

const ConfigDialog = ({ isConfigDialogOpen, closeConfigDialog }: ConfigDialogProps) => {
  const { config, setConfig } = useContext(ConfigContext)
  const [tmpConfig, setTmpConfig] = useState(config)

  const closeAndUpdate = () => {
    setConfig(tmpConfig)
    closeConfigDialog()
  }

  const closeWithoutUpdate = () => {
    closeConfigDialog()
  }

  return (
      <Dialog open={isConfigDialogOpen}>
        <DialogTitle>Set configuration (Empty for default values)</DialogTitle>
        <DialogContent>
          <TextField
            label="Project ID"
            id="projectId"
            type="text"
            autoFocus
            margin="dense"
            fullWidth
            variant="outlined"
            value={tmpConfig.projectId}
            onChange={(e) => setTmpConfig({ ...tmpConfig, projectId: e.target.value })}
          />
          <TextField
            label="Catalog Name"
            id="catalogName"
            type="text"
            margin="dense"
            fullWidth
            variant="outlined"
            value={tmpConfig.catalogName}
            onChange={(e) => setTmpConfig({ ...tmpConfig, catalogName: e.target.value })}
          />
          <TextField
            label="Search Service Name"
            id="searchServiceName"
            type="text"
            margin="dense"
            fullWidth
            variant="outlined"
            value={tmpConfig.searchServiceName}
            onChange={(e) => setTmpConfig({ ...tmpConfig, searchServiceName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWithoutUpdate}>Cancel</Button>
          <Button onClick={closeAndUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

  )
}

export default ConfigDialog