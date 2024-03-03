import { TextField, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { KeyboardEvent, useState } from "react";

export default function UserInput(props: {
  handleSubmit: (arg1: string) => void;
}) {
  const { handleSubmit } = props;

  const [message, setMessage] = useState("");

  function handleShiftEnter(event: KeyboardEvent<HTMLDivElement>) {
    if (event.code == "Enter" && !event.shiftKey  ) {
      handleSubmit(message);
      setMessage("");
    }
  }
  return (
    <TextField
      fullWidth
      multiline
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      onKeyDown={(event) => handleShiftEnter(event)}
      InputProps={{
        endAdornment: (
          <InputAdornment
            sx={{ alignSelf: "end", marginBottom: "10px" }}
            position="end"
          >
            <IconButton>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
