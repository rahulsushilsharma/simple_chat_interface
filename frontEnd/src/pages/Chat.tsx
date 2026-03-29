import MenuIcon from "@mui/icons-material/Menu";
import { Box, Container, IconButton, Tooltip, Typography } from "@mui/material";
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
import { saveSessons } from "../utils/history";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Typing dots animation ────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        px: 2,
        py: 1.5,
        borderRadius: "16px 16px 16px 4px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        width: "fit-content",
        "& span": {
          display: "block",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#5B8DEF",
          animation: "bounce 1.2s infinite ease-in-out",
        },
        "& span:nth-of-type(2)": { animationDelay: "0.2s" },
        "& span:nth-of-type(3)": { animationDelay: "0.4s" },
        "@keyframes bounce": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: 0.4 },
          "40%": { transform: "translateY(-6px)", opacity: 1 },
        },
      }}
    >
      <span />
      <span />
      <span />
    </Box>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <Tooltip title={label} arrow placement="top">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1.2,
          py: 0.4,
          borderRadius: "6px",
          background: "rgba(91,141,239,0.08)",
          border: "1px solid rgba(91,141,239,0.15)",
          cursor: "default",
        }}
      >
        <Typography
          sx={{
            fontSize: "10px",
            color: "#6B7280",
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "11px",
            color: "#5B8DEF",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Tooltip>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ model }: { model?: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 2,
        userSelect: "none",
      }}
    >
      {/* Glow orb */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 35%, #5B8DEF 0%, #1a2744 60%, transparent 100%)",
          boxShadow: "0 0 40px rgba(91,141,239,0.25)",
          mb: 1,
        }}
      />
      <Typography
        sx={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          fontWeight: 600,
          color: "#E8EAF0",
          letterSpacing: "-0.02em",
        }}
      >
        What can I help you with?
      </Typography>
      {model && (
        <Typography
          sx={{
            fontSize: "13px",
            color: "#4B5563",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {model}
        </Typography>
      )}
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function Chat() {
  const drawerWidth = 280;
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
  const [sesson, setSesson] = useState<SessonInterface>({ id: "-1", name: "" });
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
    getHistory(sesson.id);
    setChatLength(0);
  }, [sesson]);

  async function getApiSessions() {
    const session = await fetch(
      "http://localhost:8000/session/session?user_id=1",
    );
    const data = await session.json();
    setSessons(
      data.map((ele: { id: string; session_name: string }) => ({
        id: ele.id,
        name: ele.session_name,
      })),
    );
  }

  useEffect(() => {
    getApiSessions();
  }, []);

  async function getHistory(session_id: string) {
    const res = await fetch(
      `http://localhost:8000/chat/get_chat?session_id=${session_id}`,
    );
    const history = await res.json();
    const localHistory = history.map(
      (ele: { message_type: any; message: any }) => ({
        type: ele.message_type,
        message: ele.message,
      }),
    );
    setFilteredMessages(localHistory);
    setMessages(localHistory);
  }

  async function createSesson(name: string, session_type: string) {
    const session_body = JSON.stringify({
      user_id: 1,
      temperature: context?.temp,
      session_name: name,
      session_type: session_type,
      model_name: context?.model?.model,
      files: "",
    });
    const sesson_res = await fetch(
      "http://localhost:8000/session/create_session",
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: session_body,
      },
    );
    const sesson = await sesson_res.json();
    setSesson({ ...sesson, name: sesson.session_name });
    setSessons((prev) => [...prev, { ...sesson, name: sesson.session_name }]);
    saveSessons([...sessons, { ...sesson, name: sesson.session_name }]);
    return { ...sesson, name: sesson.session_name };
  }

  function updateMessage(message: MessageInterface) {
    setMessages((prev) => [...prev, message]);
  }

  async function deleteSession(session_id: string) {
    await fetch(
      `http://localhost:8000/session/delete_session?session_id=${session_id}`,
      {
        method: "DELETE",
      },
    );
  }

  function deleteSession_(id: string) {
    deleteSession(id);
    setSessons((prev) => prev.filter((ele) => ele.id !== id));
    setSesson({ id: "-1", name: "" });
  }

  async function scrollToBottom() {
    if (!chatContainer.current) return;
    msgRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(querry: string) {
    let session = sesson;
    if (sesson.id == "-1") session = await createSesson(querry, "chat");

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
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        session_id: session.id,
        message_type: "user",
        message: querry,
      }),
    });

    const stream = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    let mes = "";
    let evalDataBuffer: typeof evalData | null = null;

    while (true && stream) {
      const { done, value } = await stream.read();
      if (done) break;

      for (const line of value.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const jsonStr = trimmed.slice(6).trim();
        if (!jsonStr) continue;

        let json: any = {};
        try {
          json = JSON.parse(jsonStr);
        } catch (e) {
          console.warn("Failed to parse chunk:", jsonStr);
          continue;
        }

        if (json?.chunk_position === "last") {
          if (evalDataBuffer) setEvalData(evalDataBuffer);
          break;
        }

        const meta = json?.response_metadata;
        if (meta?.done === true && meta?.done_reason === "stop") {
          evalDataBuffer = {
            total_duration: meta.total_duration / 1000000000,
            load_duration: meta.load_duration / 1000000000,
            prompt_eval_count: meta.prompt_eval_count,
            prompt_eval_duration: meta.prompt_eval_duration / 1000000000,
            eval_count: meta.eval_count,
            eval_duration: meta.eval_duration / 1000000000,
          };
          continue;
        }

        const chunk = json?.content ?? "";
        if (chunk) {
          mes += chunk;
          setMessage(mes);
        }
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

  const cachedSideBar = useMemo(
    () => (
      <Sidebar
        deleteSession={deleteSession_}
        setSesson={setSesson}
        sesson={sesson}
        sessons={sessons}
        open={isDrawerOpen}
        drawerWidth={drawerWidth}
        handleClose={() => setDrawerOpen(false)}
      />
    ),
    [sesson, sessons, isDrawerOpen, drawerWidth],
  );

  const evalRate =
    evalData?.eval_count && evalData?.total_duration
      ? (evalData.eval_count / evalData.total_duration).toFixed(1)
      : null;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      `}</style>

      <Box
        sx={{
          height: "100dvh",
          position: "relative",
          ml: isDrawerOpen ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s cubic-bezier(0.4,0,0.2,1)",
          background: "#0A0B0E",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sidebar toggle button when closed */}
        {!isDrawerOpen && (
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "fixed",
              top: 12,
              left: 12,
              zIndex: 100,
              color: "#6B7280",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              p: 1,
              "&:hover": {
                background: "rgba(91,141,239,0.12)",
                color: "#5B8DEF",
                borderColor: "rgba(91,141,239,0.3)",
              },
              transition: "all 0.2s",
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        )}

        {cachedSideBar}

        {/* Message area */}
        <Box
          ref={chatContainer}
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 2, md: 4 },
            pt: 3,
            pb: 2,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.08) transparent",
            "&::-webkit-scrollbar": { width: 5 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.08)",
              borderRadius: 4,
            },
          }}
        >
          <Container maxWidth="md" disableGutters>
            {sesson.id == "-1" ? (
              <EmptyState model={context?.model?.model} />
            ) : (
              <Box display="grid" gap="0.75em">
                <MessageList messages={messages} />

                {isStreaming && (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {message ? (
                      <Message
                        message={message}
                        type="assistant"
                        message_sequence={0}
                      />
                    ) : (
                      <TypingIndicator />
                    )}
                  </Box>
                )}

                <Box ref={msgRef} sx={{ height: "1px" }} />
              </Box>
            )}
          </Container>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(10,11,14,0.92)",
            backdropFilter: "blur(12px)",
            pt: 1.5,
            pb: 2,
            px: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="md" disableGutters>
            {/* Eval stats */}
            {evalData && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.8,
                  mb: 1.5,
                  alignItems: "center",
                }}
              >
                <StatChip
                  label="total"
                  value={`${evalData.total_duration.toFixed(2)}s`}
                />
                <StatChip
                  label="prompt"
                  value={`${evalData.prompt_eval_count} tok`}
                />
                <StatChip label="output" value={`${evalData.eval_count} tok`} />
                <StatChip
                  label="eval"
                  value={`${evalData.eval_duration.toFixed(2)}s`}
                />
                {evalRate && (
                  <StatChip label="speed" value={`${evalRate} t/s`} />
                )}
              </Box>
            )}

            {/* Input */}
            <UserInput handleSubmit={handleSubmit} />

            {/* Model + temp footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
                px: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#374151",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.02em",
                }}
              >
                {context?.model?.model}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#374151",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {context?.temp !== undefined ? `temp ${context.temp}` : ""}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default Chat;
