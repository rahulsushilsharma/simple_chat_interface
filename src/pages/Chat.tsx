import { Box, Container, IconButton } from "@mui/material";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import theme from "../theme";
import { MessageList, Message } from "../components/Message";
import UserInput from "../components/UserInput";
import { Ollama } from "@langchain/community/llms/ollama";
import { v4 as uuidv4 } from "uuid";
import { getChat, getSessons, saveChat, saveSessons } from "../utils/history";
import MenuIcon from "@mui/icons-material/Menu";
import { UserContext} from "../components/UserContextProvider";
import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';

function Chat() {
  const drawerWidth = 300;
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const [isStreaming, setStreaming] = useState(false);
  const [message, setMessage] = useState("");
  const msgRef = useRef<any>();
  const [messages, setMessages] = useState<any[]>([]);
  const [sessons, setSessons] = useState<any[]>([]);
  const [sesson, setSesson] = useState<any>({
    id: "-1",
    name: "",
  });
  const {context }= useContext(UserContext)
  const scrollToBottom = useScrollToBottom();
  useEffect(() => {
    console.log(context)
  },[context])


  useEffect(() => {
    console.log(sesson);
    if (sesson.id == "-1") {
      setMessages([]);
      return;
    }
    const chats = getChat(sesson.id);
    if (chats) setMessages(chats);
    console.log(chats);
  }, [sesson]);

  useEffect(() => {
    const sessons = getSessons();
    if (sessons) setSessons(sessons);
  }, []);

  useEffect(() => {
    console.log(messages);
    saveChat(sesson.id, messages);
  }, [messages]);

  function createSesson(name: string) {
    const sessonId = uuidv4();
    const sesson = {
      id: sessonId,
      name: name,
    };

    setSesson(sesson);
    setSessons((prev) => [...prev, sesson]);
    saveSessons([...sessons, sesson]);
  }

  function updateMessage(message: any) {
    setMessages((prev) => {
      return [...prev, message];
    });
  }

  async function handleSubmit(querry: string) {
    if (sesson.id == "-1") {
      createSesson(querry);
    }

    setStreaming(true);
    updateMessage({ type: "human", message: querry });

    const ollama = new Ollama({
      baseUrl: "http://localhost:11434", // Default value
      model: context.userSettingsChat.model.value, // Default value
      temperature: context.userSettingsChat.temp,
    });

    const stream = await ollama.stream(querry);
    let mes = "";

    for await (const chunk of stream) {
      mes += chunk;
      setMessage(mes);
      // scrollToBottom()
      msgRef.current.scrollToView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
    
    setStreaming(false);
    updateMessage({ type: "AI", message: mes });
    setMessage("");
  }
  // const drawerWidth = 240; // You can adjust the initial width of the drawer

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
  }

  const cachedSideBar = useMemo(
    () => (
      <Sidebar
        setSesson={setSesson}
        sesson={sesson}
        sessons={sessons}
        open={isDrawerOpen}
        drawerWidth={drawerWidth}
        handleClose={handleDrawerClose}
      />
    ),
    [sesson, sessons, isDrawerOpen]
  );

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
        {!isDrawerOpen && (
          <IconButton
            sx={{
              position: "sticky",
              top: 0,
            }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        )}
        {cachedSideBar}

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
          <Container>
            <ScrollToBottom>
            <Box display="grid" gap="1em">
              <MessageList messages={messages} />

              {isStreaming && (
                <Message id="cursor" message={message} type={"AI"} />
              )}
          <Box ref={msgRef} sx={{background:"blue"}} height={"10px"} width="100%"></Box>
              
            </Box>
            </ScrollToBottom>
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
