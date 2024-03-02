import { Avatar, Box, Paper, Typography } from "@mui/material";
import { blue, green } from "@mui/material/colors";

export default function Message(props: {
  userMsg: string;
  msgType: "AI" | "human";
}) {
  const { userMsg, msgType } = props;
  return (
    <Paper>
      <Box>
        {msgType == "AI" ? (
          <>
            <Avatar sx={{ bgcolor: blue[500] }} variant="rounded">
              AI
            </Avatar>
            <Typography>{userMsg}</Typography>
          </>
        ) : (
          <>
            <Avatar sx={{ bgcolor: green[500] }} variant="rounded">
              H
            </Avatar>
            <Typography>{userMsg}</Typography>
          </>
        )}
      </Box>
    </Paper>
  );
}
