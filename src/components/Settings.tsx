import { Dispatch } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Slider, TextField } from "@mui/material";

export default function SettingsDialog(props: {
  openState: [boolean, Dispatch<React.SetStateAction<boolean>>];
}) {
  const [open, setOpen] = props.openState;

  const handleClose = () => {
    setOpen(false);
  };

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: "Pulp Fiction", year: 1994 },
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
        <DialogContent>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={top100Films}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie" />}
          />
          <Slider
            aria-label="Temperature"
            defaultValue={30}
            // getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            shiftStep={30}
            step={10}
            marks
            min={10}
            max={110}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
