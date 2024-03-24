import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import { blue, green } from "@mui/material/colors";
import { memo, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MessageInterface, CitationInterface } from "../interfaces/Interfaces";

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
  const { message, type, citation } = props;
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
            <span className="cursor"></span>

            {citation && <CitationDialog citation={citation} />}
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

function CitationDialog(props: { citation: CitationInterface[] }) {
  const [open, setOpen] = useState(false);
  const citation = props.citation;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function showMetadataa(metadata: Record<string, unknown>) {
    const meta = [];
    for (const [key, value] of Object.entries(metadata)) {
      meta.push(`${key}: ${value}`);
    }
    return meta;
  }
  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ width: "100%" }}
      >
        view citation
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
        <DialogContent sx={{ maxHeight: "80vh" }}>
          {citation.map((val, index) => (
            <Box key={index}>
              <DialogContentText id="alert-dialog-description">
                {val.page_content}
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                {showMetadataa(val.metadata).map((val, index) => (
                  <Typography key={index}>{val}</Typography>
                ))}
              </DialogContentText>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClose} variant="contained">
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function MessageList_(props: { messages: MessageInterface[] }) {
  return (
    <>
      {props.messages.map((val, index) => (
        <Message_
          key={index}
          message={val.message}
          type={val.type as "human" | "AI"}
          citation={val.citation}
          message_sequence={val.message_sequence}
        />
      ))}
    </>
  );
}
const Message = memo(Message_);

const MessageList = memo(MessageList_);

export { Message, MessageList };
