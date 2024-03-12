import { Dispatch, useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  Box,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { UserContext } from "../components/UserContextProvider";

export default function SettingsDialog(props: {
  openState: [boolean, Dispatch<React.SetStateAction<boolean>>];
}) {
  const [open, setOpen] = props.openState;
  const {context, setContext} = useContext(UserContext)

  const [userSettings, setUserSettings] = useState(context.userSettingsChat)

  function saveSettings(){
    setContext((prev)=>{
      return {
        ...prev,
        userSettingsChat: userSettings
      }
    })
    console.log(userSettings)
    handleClose()
  }

  const handleClose = () => {
    setOpen(false);
  };

  const Models = [
    { value: "dolphin-mistral", label: "mistral" },
    { value: "dolphin-phi", label: "phi" },
    { value: "llama2-uncensored", label: "llama2" },
    { value: "tinyllama", label: "tinyllama" },
    { value: "deepseek-coder", label: "deepseek-coder" },
    { value: "qwen:0.5b", label: "qwen:0.5b" },
  ];
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle textAlign="center" id="dialog-title">
          {"User Settings"}
        </DialogTitle>

        <DialogContent sx={{ height: "30vh" }}>
          <Box display="grid" gap="1em">
            <Autocomplete
              disablePortal
              disableClearable
              value={userSettings.model}
              onChange={(_e, value) => setUserSettings({ ...userSettings, model: value || {value:"qwen:0.5b",label:"qwen:0.5b"} })}
              id="combo-box-demo"
              isOptionEqualToValue={(option, value) => option.value === value.value}
              options={Models}
              renderInput={(params) => <TextField {...params} label="Model" />}
            />
            <Box>
              <Typography>Temperature (0-1) {userSettings.temp}</Typography>
              <Slider
                aria-label="Temperature"
                value={userSettings.temp}
                onChange={(_e, value) =>{
                  if(typeof value === "number")
                  setUserSettings({ ...userSettings, temp: value })
                }}
                valueLabelDisplay="auto"
                shiftStep={30}
                step={0.1}
                marks
                min={0}
                max={1}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={saveSettings} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
