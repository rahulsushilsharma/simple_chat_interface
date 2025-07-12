import { Dispatch, useContext, useEffect, useState } from "react";
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
  const { context, setContext } = useContext(UserContext);

  const [userSettings, setUserSettings] = useState(context);

  function saveSettings() {
    setContext((prev) => {
      return {
        ...prev,
        ...userSettings,
      };
    });
    console.log(userSettings);
    handleClose();
  }

  const handleClose = () => {
    setOpen(false);
  };

  const [models, setModels] = useState([]);

  async function getModels() {
    const models = await fetch("http://localhost:11434/api/tags").then(
      (response) => response.json()
    );
    console.log(models);
    setModels(models.models);
    setContext({
      temp: 0.7,
      model: models.models[0],
    });
    setUserSettings({ model: models.models[0], temp: 0.7 });
  }

  useEffect(() => {
    getModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

        <DialogContent sx={{ height: "30dvh" }}>
          <Box display="grid" gap="1em">
            <Box
              display="flex"
              gap="1em"
              width="100%"
              justifyContent="space-between"
            >
              <Autocomplete
                disablePortal
                disableClearable
                fullWidth
                value={userSettings?.model}
                onChange={(_e, value) =>
                  setUserSettings({
                    ...userSettings,
                    model: value,
                  })
                }
                id="combo-box-demo"
                isOptionEqualToValue={(option, value) =>
                  option.model === value.model
                }
                options={models}
                getOptionLabel={(option) => option.model}
                renderInput={(params) => (
                  <TextField {...params} label="Model" />
                )}
              />
            </Box>
            <Box>
              <Typography>Temperature (0-1) {userSettings?.temp}</Typography>
              <Slider
                aria-label="Temperature"
                value={userSettings?.temp}
                onChange={(_e, value) => {
                  if (typeof value === "number")
                    setUserSettings({ ...userSettings, temp: value });
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
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveSettings} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
