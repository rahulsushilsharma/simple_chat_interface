import { Avatar, Box, Paper, Typography } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import { memo } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import theme from "../theme";
interface Message {
  message: string;
  type: "AI" | "human";
}

function CustomSyntaxHighlighter(props: any) {
  const { children, className ,...rest} = props;
  const match = /language-(\w+)/.exec(className || "");
  return (
    <>
      {match ? (
        <Paper elevation={3}>
          <Box>
            <Typography>{match[1]}</Typography>
          </Box>
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children)}
            language={match[1]}
            style={darcula}
          />
        </Paper>
      ) : (
        <strong
          style={{ background: theme.palette.text.disabled, padding: "0 5px" }}
        >
          {String(children)}
        </strong>
      )}
    </>
  );
}

function Message_(props: Message) {
  const { message, type } = props;
  return (
    <Paper>
      {type == "AI" ? (
        <Box display="flex" alignItems="center" gap="1em">
          <Avatar
            sx={{ bgcolor: blue[500], alignSelf: "start" }}
            variant="rounded"
          >
            AI
          </Avatar>

          <Box padding="0 1em">
            <Markdown
              children={message}
              components={{
                code(props) {
                  return <CustomSyntaxHighlighter {...props} />;
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" gap="1em">
          <Avatar
            sx={{ bgcolor: green[500], alignSelf: "start" }}
            variant="rounded"
          >
            H
          </Avatar>
          <Box padding="0 1em">
            <Markdown
              children={message}
              components={{
                code(props) {
                  return <CustomSyntaxHighlighter {...props} />;
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Paper>
  );
}

function MessageList_(props: { messages: Message[] }) {
  return (
    <>
      {props.messages.map((val, index) => (
        <Message_
          key={index}
          message={val.message}
          type={val.type as "human" | "AI"}
        />
      ))}
    </>
  );
}
const Message = memo(Message_);

const MessageList = memo(MessageList_);

export { Message, MessageList };
