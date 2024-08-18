import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { blue, green } from "@mui/material/colors";
import { memo } from "react";

import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

import { MessageInterface } from "../interfaces/Interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomSyntaxHighlighter(props: any) {
  const { children, className, ...rest } = props;
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";
  console.log(language, children, match);
  return (
    <>
      {children?.includes("\n") ? (
        <Paper elevation={3}>
          <Box>
            <Typography>{language}</Typography>
          </Box>
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children)}
            language={language}
            style={darcula}
          />
        </Paper>
      ) : (
        <span>
          <strong>{children}</strong>
        </span>
      )}
    </>
  );
}

function Message_(props: MessageInterface) {
  const { message, type } = props;
  console.log(message, type);
  return (
    <Paper sx={{ overflow: "auto" }}>
      <Box>
        {type == "assistant" ? (
          <Avatar
            sx={{ bgcolor: blue[500], alignSelf: "start", margin: "1em" }}
            variant="rounded"
          >
            AI
          </Avatar>
        ) : (
          <Avatar
            sx={{ bgcolor: green[500], alignSelf: "start", margin: "1em" }}
            variant="rounded"
          >
            H
          </Avatar>
        )}
        <Container>
          <Markdown
            children={message}
            components={{
              code(props) {
                return <CustomSyntaxHighlighter {...props} />;
              },
            }}
          />
          <span className="cursor"></span>
        </Container>
      </Box>
    </Paper>
  );
}

function MessageList_(props: { messages: MessageInterface[] }) {
  return (
    <>
      {props.messages.map((val, index) => (
        <Message_
          key={index}
          message={val.message}
          type={val.type}
          message_sequence={val.message_sequence}
        />
      ))}
    </>
  );
}
const Message = memo(Message_);

const MessageList = memo(MessageList_);

export { Message, MessageList };
