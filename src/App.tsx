import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import "./App.css";

import { useState } from "react";
import Sidebar from "./pages/Chat";
import Message from "./components/Message";
import SendIcon from "@mui/icons-material/Send";
import theme from "./theme";


function App() {
  const drawerWidth = 300;

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [messages, setMessages] = useState<any[]>([
    {
      type: "human",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      type: "AI",
      message:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      type: "human",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      type: "AI",
      message:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      type: "human",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      type: "AI",
      message:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ]);

  const markdown = `Here is some JavaScript code:

~~~jsx
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import "./App.css";

import { useState } from "react";
import Sidebar from "./pages/Chat";
import Message from "./components/Message";
import SendIcon from "@mui/icons-material/Send";
import theme from "./theme";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const drawerWidth = 300;

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [messages, setMessages] = useState<any[]>([
    {
      type: "human",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      type: "AI",
      message:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      type: "human",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      type: "AI",
      message:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      type: "human",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      type: "AI",
      message:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ]);

  ;
  function updateMessage(message: any) {
    setMessages((prev) => {
      return [message, ...prev];
    });
  }

  function handleSubmit() {}
  // const drawerWidth = 240; // You can adjust the initial width of the drawer

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
  }

  return (
    <>
      <Box
        height="100dvh"
        position="relative"
        style={{
          marginLeft: isDrawerOpen ? drawerWidth : 0,
          transition: "margin 0.3s",
        }}
      >
        {!isDrawerOpen && <Button onClick={handleDrawerOpen}>open</Button>}
        <Sidebar
          open={isDrawerOpen}
          drawerWidth={drawerWidth}
          handleClose={handleDrawerClose}
        />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          <Container>
            <Box display="grid" gap="1em">
              {messages.map((val, index) => (
                <Message
                  key={index}
                  userMsg={val.message}
                  msgType={val.type as "human" | "AI"}
                />
              ))}
              
            </Box>
          </Container>
          <Container
            sx={{
              position: "sticky",
              bottom: 0,
              background: theme.palette.background.default,
            }}
          >
            <TextField
              fullWidth
              multiline
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
          </Container>
        </Box>
      </Box>
    </>
  );
}
export default App;

~~~
`;
  function updateMessage(message: any) {
    setMessages((prev) => {
      return [message, ...prev];
    });
  }

  function handleSubmit() {}
  // const drawerWidth = 240; // You can adjust the initial width of the drawer

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
  }

  return (
    <>
      <Box
        height="100dvh"
        position="relative"
        style={{
          marginLeft: isDrawerOpen ? drawerWidth : 0,
          transition: "margin 0.3s",
        }}
      >
        {!isDrawerOpen && <Button onClick={handleDrawerOpen}>open</Button>}
        <Sidebar
          open={isDrawerOpen}
          drawerWidth={drawerWidth}
          handleClose={handleDrawerClose}
        />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          <Container>
            <Box display="grid" gap="1em">
              {messages.map((val, index) => (
                <Message
                  key={index}
                  userMsg={val.message}
                  msgType={val.type as "human" | "AI"}
                />
              ))}
              
            </Box>
          </Container>
          <Container
            sx={{
              position: "sticky",
              bottom: 0,
              background: theme.palette.background.default,
            }}
          >
            <TextField
              fullWidth
              multiline
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
          </Container>
        </Box>
      </Box>
    </>
  );
}
export default App;
