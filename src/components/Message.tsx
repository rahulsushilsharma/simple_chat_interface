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
  TextField,
  Typography,
} from "@mui/material";
import { blue, green } from "@mui/material/colors";
import { memo, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import theme from "../theme";

interface citation {
  page_content: string;
  metadata: any;
}
interface Message {
  message: string;
  type: "AI" | "human";
  id?: string;
  citation?: citation[] | any[];
}

function CustomSyntaxHighlighter(props: any) {
  const { children, className, ...rest } = props;
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
  const { message, type, id, citation } = props;
  return (
    <Paper id={id}>
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

function CitationDialog(props: { citation: citation[] | any[] }) {
  const [open, setOpen] = useState(false);
  const citation = props.citation;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
                {val.metadata}
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

function MessageList_(props: { messages: Message[] }) {
  return (
    <>
      {props.messages.map((val, index) => (
        <Message_
          key={index}
          message={val.message}
          type={val.type as "human" | "AI"}
          citation={val.citation}
        />
      ))}
    </>
  );
}
const Message = memo(Message_);

const MessageList = memo(MessageList_);

export { Message, MessageList };
