import { Avatar, Box, Paper, Typography } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";




export default function Message(props: {
  userMsg: string;
  msgType: "AI" | "human";
}) {
  const { userMsg, msgType } = props;
  return (
    <Paper>
      {msgType == "AI" ? (
        <Box display="flex" alignItems="center" gap="1em">
          <Avatar sx={{ bgcolor: blue[500] }} variant="rounded">
            AI
          </Avatar>
          <Markdown
            children={userMsg}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    // {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    // style={dark}
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </Box>
      ) : (
        <Box display="flex" alignItems="center" gap="1em">
          <Avatar sx={{ bgcolor: green[500] }} variant="rounded">
            H
          </Avatar>
          <Typography>{userMsg}</Typography>
        </Box>
      )}
    </Paper>
  );
}
