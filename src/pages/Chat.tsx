import { Box, Button, Container } from "@mui/material";

import { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import theme from "../theme";
import Message from "../components/Message";
import UserInput from "../components/UserInput";
import { Ollama } from "@langchain/community/llms/ollama";

function Chat() {
  const drawerWidth = 300;
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isStreaming, setStreaming] = useState(false);
  const [message, setMessage] = useState("");
  const msgRef = useRef<any>()
  const [messages, setMessages] = useState<any[]>([]);

  function updateMessage(message: any) {
    setMessages((prev) => {
      return [...prev, message];
    });
  }

  async function handleSubmit(querry: string) {
    updateMessage({ type: "human", message: querry });
    setStreaming(true);
    const ollama = new Ollama({
      baseUrl: "http://localhost:11434", // Default value
      model: "tinyllama", // Default value
    });

    const stream = await ollama.stream(querry);
    let mes = ''
    for await (const chunk of stream) {
      mes += chunk
      setMessage(mes)
      msgRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    setStreaming(false);
    updateMessage({ type: "AI", message: mes });
    setMessage("")
  }
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
              {isStreaming && <Message userMsg={message} msgType={"AI"} />}
              
            </Box>
            <Box ref={msgRef} ></Box>
          </Container>
          <Container
            sx={{
              position: "sticky",
              bottom: 0,
              background: theme.palette.background.default,
            }}
          >
            <UserInput handleSubmit={handleSubmit} />
          </Container>
        </Box>
      </Box>
    </>
  );
}
export default Chat;
