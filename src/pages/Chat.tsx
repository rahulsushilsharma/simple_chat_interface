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
import { UserContext } from "../components/UserContextProvider";
import Upload from "../components/Upload";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function Chat() {
  const drawerWidth = 300;
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const [isStreaming, setStreaming] = useState(false);
  const [message, setMessage] = useState("");
  const msgRef = useRef<HTMLDivElement>();
  const chatContainer = useRef<HTMLDivElement>();

  const [messages, setMessages] = useState<any[]>([]);
  const [sessons, setSessons] = useState<any[]>([]);
  const [sesson, setSesson] = useState<any>({
    id: "-1",
    name: "",
  });
  const { context } = useContext(UserContext);
  useEffect(() => {
    console.log(context);
  }, [context]);

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

  // const resize_ob = new ResizeObserver(function(entries) {
  //   // since we are observing only a single element, so we access the first element in entries array
  //   let rect = entries[0].contentRect;

  //   // current width & height
  //   let width = rect.width;
  //   let height = rect.height;

  //   console.log('Current Width : ' + width);
  //   console.log('Current Height : ' + height);
  // });

  // useEffect(() => {
  //   if (!msgRef.current) return;
  //   const resizeObserver = new ResizeObserver(() => {
  //     // Do what you want to do when the size of the element changes
  //     console.log("changed",msgRef.current);
  //   });
  //   resizeObserver.observe(msgRef.current);
  //   return () => resizeObserver.disconnect(); // clean up
  // }, []);
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
  //   function scrollToBottom() {
  //     // Select the scrolling div

  //     let scrollingDiv = msgRef.current;

  // if(!scrollingDiv) return
  //     // Scroll to the bottom
  //     console.log(scrollingDiv, scrollingDiv.scrollHeight)

  //     scrollingDiv.scrollTop = scrollingDiv.scrollHeight;
  // }

  async function scrollToBottom() {
    if (!chatContainer.current) return;
    msgRef.current?.scrollIntoView({ behavior: "instant" });
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
    if (chatContainer.current)
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    const stream = await ollama.stream(querry);
    let mes = "";
    for await (const chunk of stream) {
      mes += chunk;
      setMessage(mes);
      await scrollToBottom();
    }

    setStreaming(false);
    updateMessage({ type: "AI", message: mes });
    // setMessage("");
  }

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
            <Box ref={chatContainer} display="grid" gap="1em">
              {sesson.id == "-1" ? (
                <Upload />
              ) : (
                <>
                  <MessageList messages={messages} />

                  <>
                    <Message id={"cursor"} message={message} type={"AI"} />
                  </>

                  <Box
                    ref={msgRef}
                    sx={{ background: "blue" }}
                    height={"10px"}
                    width="100%"
                  ></Box>
                </>
              )}
            </Box>
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
