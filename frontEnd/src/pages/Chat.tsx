import { Box, Container, IconButton, Typography } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Message, MessageList } from "../components/Message";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../components/UserContextProvider";
import UserInput from "../components/UserInput";
import {
  MessageInterface,
  OllamaMessageInterface,
  SessonInterface,
} from "../interfaces/Interfaces";
import theme from "../theme";
import { saveSessons } from "../utils/history";

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

  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<
    OllamaMessageInterface[]
  >([]);

  const [sessons, setSessons] = useState<SessonInterface[]>([]);
  const [sesson, setSesson] = useState<SessonInterface>({
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
    if (sesson.id == "-1") {
      setMessages([]);
      return;
    }
    getHistory(sesson.id)
    setChatLength(0);
  }, [sesson]);


  async function getApiSessions() {
    const session = await fetch("http://localhost:8000/session/session?user_id=1")
    const data = await session.json()
    console.log(data.map((ele: { id: string; session_name: string; }) => { return { id: ele.id, name: ele.session_name } }))
    setSessons(data.map((ele: { id: string; session_name: string; }) => { return { id: ele.id, name: ele.session_name } }))
  }
  useEffect(() => {
    // const sessons = getSessons();
    getApiSessions()
    // if (sessons) setSessons(sessons);
  }, []);


  async function getHistory(session_id: string) {
    const res = await fetch(`http://localhost:8000/chat/get_chat?session_id=${session_id}`)
    const history = await res.json()
    const localHistory = history.map(ele => { return { type: ele.message_type, message: ele.message } })
    console.log(localHistory)
    setFilteredMessages(localHistory)
    setMessages(localHistory)

  }
  // useEffect(() => {
  //   saveChat(sesson.id, messages);
  //   setFilteredMessages(
  //     messages.map((m) => {
  //       return { role: m.type, content: m.message };
  //     })
  //   );
  // }, [messages, sesson.id]);

  async function createSesson(name: string, session_type: string) {
    // const sessonId = uuidv4();
    const session_body = JSON.stringify({
      "user_id": 1,
      "temperature": 0,
      "session_name": name,
      "session_type": session_type,
      "model_name": "goekdenizguelmez/JOSIEFIED-Qwen3:0.6b",
      "files": ""
    })
    const sesson_res = await fetch("http://localhost:8000/session/create_session", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: session_body
    })
    const sesson = await sesson_res.json()

    setSesson({ ...sesson, name: sesson.session_name });
    setSessons((prev) => [...prev, { ...sesson, name: sesson.session_name }]);
    saveSessons([...sessons, { ...sesson, name: sesson.session_name }]);

    return { ...sesson, name: sesson.session_name }
  }

  function updateMessage(message: MessageInterface) {
    setMessages((prev) => {
      return [...prev, message];
    });
  }

  async function deleteSession(session_id: string) {
    await fetch(`http://localhost:8000/session/delete_session?session_id=${session_id}`, {
      method: "DELETE"
    })

  }

  function deleteSession_(id: string) {
    deleteSession(id);
    setSessons(prev => prev.filter(ele => ele.id !== id));
    setSesson({ id: "-1", name: "" });

  }
  async function scrollToBottom() {
    if (!chatContainer.current) return;
    msgRef.current?.scrollIntoView({ behavior: "instant" });
  }

  async function handleSubmit(querry: string) {
    let session = sesson
    if (sesson.id == "-1") {
      session = await createSesson(querry, "chat");
    }

    setStreaming(true);
    updateMessage({
      type: "user",
      message: querry,
      message_sequence: chatLength,
    });
    setChatLength(chatLength + 1);
    await delay(100);

    if (chatContainer.current)
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;

    const response = await fetch("http://localhost:8000/chat/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({
        "session_id": session.id,
        "message_type": "user",
        "message": querry
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
        deleteSession={deleteSession_}
        setSesson={setSesson}
        sesson={sesson}
        sessons={sessons}
        open={isDrawerOpen}
        drawerWidth={drawerWidth}
        handleClose={handleDrawerClose}
      />
    ),
    [sesson, sessons, isDrawerOpen, drawerWidth]
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
              {evalData && (
                <Typography fontSize="13px">
                  {" "}
                  Total Duration:{evalData?.total_duration?.toFixed(2)}, Prompt
                  Eval Count: {evalData?.prompt_eval_count?.toFixed(2)}, Prompt
                  Eval Duration: {evalData?.prompt_eval_duration?.toFixed(2)},
                  Eval Count: {evalData?.eval_count?.toFixed(2)}, Eval Duration:{" "}
                  {evalData?.eval_duration?.toFixed(2)}, eval rate{" "}
                  {evalData?.eval_count &&
                    evalData?.total_duration &&
                    (evalData?.eval_count / evalData?.total_duration).toFixed(
                      2
                    )}
                  tokens/seconds
                </Typography>
              )}
            </Box>
            <UserInput handleSubmit={handleSubmit} />
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize="13px">{context?.model?.model}</Typography>
              <Typography fontSize="13px">{context?.temp}</Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
export default Chat;
