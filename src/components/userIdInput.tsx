// dialog to input user id and save it to local storage
import { Dispatch, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
export default function UserIdInput(props: {
  openState: [boolean, Dispatch<React.SetStateAction<boolean>>];
}) {
  const [open, setOpen] = props.openState;
  const [userId, setUserId] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function saveUserIdToLocalStorage() {
    localStorage.setItem("userId", userId);
    setOpen(false);
  }

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ width: "100%" }}
      >
        Set User ID
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }} id="alert-dialog-title">
          {"Set User ID"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please enter your user ID
          </DialogContentText>
          <TextField
            autoFocus
            id="name"
            label="User ID"
            type="text"
            fullWidth
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={saveUserIdToLocalStorage} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
