import { Box, Container, IconButton, Typography } from "@mui/material";

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
import { MessageInterface } from "../interfaces/Interfaces";

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
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);

  const [sessons, setSessons] = useState<any[]>([]);
  const [sesson, setSesson] = useState<any>({
    id: "-1",
    name: "",
  });

  const [evalData, setEvalData] = useState<{
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
  }>();

  const [chatLength, setChatLength] = useState(0);
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
    setChatLength(0);
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
    setFilteredMessages(
      messages.map((m) => {
        return { role: m.type, content: m.message };
      })
    );
  }, [messages, sesson.id]);

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

  function updateMessage(message: MessageInterface) {
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
    updateMessage({
      type: "user",
      message: querry,
      message_sequence: chatLength,
    });
    setChatLength(chatLength + 1);
    await delay(100);
    console.log("messages", filteredMessages);
    // const ollama = new Ollama({
    //   baseUrl: "http://localhost:11434", // Default value
    //   model: context?.model?.model, // Default value
    //   temperature: context?.temp,
    // });

    if (chatContainer.current)
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;

    // const stream = await ollama.stream(querry);

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [...filteredMessages, { role: "user", content: querry }],
        // temperature: context?.temp,
        model: context?.model?.model,
        stream: true,
      }),
    });

    const stream = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();

    let mes = "";
    // eslint-disable-next-line no-constant-condition
    while (true && stream) {
      const { done, value } = await stream.read();
      if (done) break; // The streaming has ended.
      console.log(value);
      for (const line of value.split("\n")) {
        if (!line) continue;
        const value = line;
        console.log("value", value);
        const json = JSON.parse(value.trim() || "{}");
        if (json?.done) {
          const evalData = {
            total_duration: json?.total_duration / 1000000000,
            load_duration: json?.load_duration / 1000000000,
            prompt_eval_count: json?.prompt_eval_count,
            prompt_eval_duration: json?.prompt_eval_duration / 1000000000,
            eval_count: json?.eval_count,
            eval_duration: json?.eval_duration / 1000000000,
          };

          setEvalData(evalData);
        }
        mes += JSON.parse(value.trim() || "{}")?.message.content;
        setMessage(mes);
      }

      await scrollToBottom();
    }
    // for await (const chunk of stream) {
    //   mes += chunk;
    //   setMessage(mes);z
    //   await scrollToBottom();
    // }

    setStreaming(false);
    updateMessage({
      type: "assistant",
      message: mes,
      message_sequence: chatLength,
    });
    setChatLength(chatLength + 1);
    setMessage("");
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
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  height="50vh"
                >
                  {" "}
                  <Typography variant="h3">Chat with Ollama</Typography>
                </Box>
              ) : (
                <>
                  <MessageList messages={messages} />

                  <>
                    {isStreaming && (
                      <Box id={"cursor"}>
                        <Message
                          message={message}
                          type={"assistant"}
                          message_sequence={0}
                        />
                      </Box>
                    )}
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
            <Box>
              {" "}
              <Typography>
                {" "}
                Total Duration:{evalData?.total_duration}, Prompt Eval Count:{" "}
                {evalData?.prompt_eval_count}, Prompt Eval Duration:{" "}
                {evalData?.prompt_eval_duration}, Eval Count:{" "}
                {evalData?.eval_count}, Eval Duration: {evalData?.eval_duration}{" "}
                eval rate{" "}
                {evalData?.eval_count &&
                  evalData?.total_duration &&
                  evalData?.eval_count / evalData?.total_duration}
                tokens/seconds
              </Typography>
            </Box>
            <UserInput handleSubmit={handleSubmit} />
          </Container>
        </Box>
      </Box>
    </>
  );
}
export default Chat;
