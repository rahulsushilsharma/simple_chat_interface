import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
} from "@mui/material";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import theme from "../theme";
import { MessageList, Message } from "../components/Message";
import UserInput from "../components/UserInput";
// import { Ollama } from "@langchain/community/llms/ollama";
// import { v4 as uuidv4 } from "uuid";
// import { getChat, getSessons, saveChat, saveSessons } from "../utils/history";
import MenuIcon from "@mui/icons-material/Menu";
import { UserContext } from "../components/UserContextProvider";
import Upload from "../components/Upload";
import UserIdInput from "../components/userIdInput";

/**
 * Delays the execution of the code for the specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay the execution.
 * @return {Promise<void>} A promise that resolves after the specified delay.
 */
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Renders the Chat component.
 *
 * @return {JSX.Element} The rendered Chat component.
 */
function Chat() {
  const baseUrl = "http://localhost:11434/app/v1/";
  const fetchHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

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
  const [openUserIdinput, setOpenUserIdinput] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { context } = useContext(UserContext);
  useEffect(() => {
    console.log(context);
  }, [context]);

  useEffect(() => {
    // load sessons from local storage
    console.log(sesson);
    if (sesson.id == "-1") {
      setMessages([]);
      return;
    }
    getChat();
    // if (chats) setMessages(chats);
    // console.log(chats);
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
    // load sessons from local storage
    getSessons();
  }, []);

  // useEffect(() => {
  //   console.log(messages);
  //   saveChat(sesson.id, messages);
  // }, [messages]);

  async function getSessons() {
    const userId = getUserIdFromLocalStorage();
    if (!userId) return;
    const querry = {
      user_id: userId,
      session_count: "100",
    };

    const sessons = await customFetch("list_user_sessions", "GET", querry);
    setSessons(sessons);
  }
  function getUserIdFromLocalStorage() {
    const userId = localStorage.getItem("userId");
    if (userId) return userId;
    setOpenUserIdinput(true);

    return null;
  }

  async function createSesson(name: string) {
    let data = {
      temperature: context.userSettingsChat.temp.toString() || "0.7",
      max_tokens:
        context.userSettingsChat.vectorDbIndex?.max_tokens.toString() || "2048",
      engine: context.userSettingsChat.model.value,
      session_title: name,
    };
    // const sessonId = uuidv4();
    // const sesson = {
    //   id: sessonId,
    //   name: name,
    // };
    const userId = getUserIdFromLocalStorage();
    if (!userId) return;
    const querry = {
      user_id: userId,
    };

    await customFetch("create_session", "POST", querry, data);
    await getSessons();
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

  async function getChat() {
    const userId = getUserIdFromLocalStorage();
    if (!userId) return;
    const querry = {
      session_id: sesson.id,
      user_id: userId,
    };
    const chats = await customFetch("get_chat_history", "GET", querry);
    const sortedChats = chats.history_chats.sort(
      (a: any, b: any) => a.msg_seq_num - b.msg_seq_num // sort in ascending order by msg_seq_num
    );
    setMessages(sortedChats);
  }
  async function customFetch(
    url: string,
    method: "POST" | "GET",
    querry: Record<string, string>,
    body?: any
  ) {
    try {
      setOpenBackdrop(true);
      const querryParms = new URLSearchParams();

      for (const key in querry) {
        querryParms.append(key, querry[key]);
      }
      url = url + "?" + querryParms.toString();
      console.log(url);

      const response = await fetch(baseUrl + url, {
        headers: fetchHeaders,
        method: method,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setOpenBackdrop(false);
      return data;
    } catch (e) {
      console.log(e);
      setOpenBackdrop(false);
      return null;
    }
  }

  async function scrollToBottom() {
    if (!chatContainer.current) return;
    msgRef.current?.scrollIntoView({ behavior: "instant" });
  }

  async function handleSubmit(querry: string) {
    if (sesson.id == "-1") {
      await createSesson(querry);
    }

    // setStreaming(true);
    updateMessage({ type: "human", message: querry });
    const userId = getUserIdFromLocalStorage();
    if (!userId) return;

    const payload_chat = {
      session_id: sesson.id,
      user_id: userId,
      temprature: context.userSettingsChat.temp.toString() || "0.7",
      max_tokens:
        context.userSettingsChat.vectorDbIndex?.max_tokens.toString() || "2048",
      engine: context.userSettingsChat.model.value,
      message: [
        {
          role: "user",
          message: querry,
        },
      ],
    };

    await customFetch("chat", "POST", {}, payload_chat);
    await getChat();
    // const ollama = new Ollama({
    //   baseUrl: "http://localhost:11434", // Default value
    //   model: context.userSettingsChat.model.value, // Default value
    //   temperature: context.userSettingsChat.temp,
    // });
    // if (chatContainer.current)
    //   chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    // const stream = await ollama.stream(querry);
    // let mes = "";
    // for await (const chunk of stream) {
    //   mes += chunk;
    //   setMessage(mes);
    //   await scrollToBottom();
    // }

    // setStreaming(false);
    // updateMessage({ type: "AI", message: mes.content.text_completion });
    setMessage("");
    scrollToBottom();
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <UserIdInput openState={[openUserIdinput, setOpenUserIdinput]} />
      <Box
        height="100dvh"
        position="relative"
        style={{
          marginLeft: isDrawerOpen ? drawerWidth : 0,
          transition: "margin 0.3s",
        }}
      >
        {!isDrawerOpen && (
          <Button
            variant="outlined"
            sx={{
              position: "sticky",
              top: 0,
            }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </Button>
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

                  {isStreaming && (
                    <>
                      <Message
                        id={isStreaming && "cursor"}
                        message={message}
                        type={"AI"}
                      />
                    </>
                  )}
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
