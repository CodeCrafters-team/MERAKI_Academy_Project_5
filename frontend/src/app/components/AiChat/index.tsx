"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export type ChatWidgetProps = {
  title?: string;
  brandColor?: string;
  position?: "bottom-right" | "bottom-left";
  welcome?: string;
  systemPrompt?: string;
  socketUrl?: string;
  chatEndpoint?: string;
};

export default function ChatWidget({
  title = `SmartPath Assistant`,
  brandColor = "#4ab0ff",
  position = "bottom-right",
  welcome = "Hello! How can I help you?",
  systemPrompt = "Always answer in English, concisely.",
  socketUrl = "http://localhost:5000",
  chatEndpoint = "http://localhost:5000/ai/chat",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([]);

  const socketRef = useRef<Socket | null>(null);
  const socketIdRef = useRef<string>("");
  const replyBufferRef = useRef<string>("");
  const currentAssistantMsgIdRef = useRef<string | null>(null);

  useEffect(() => {
    const s = io(socketUrl, { withCredentials: true });
    socketRef.current = s;

    s.on("connect", () => {
      // @ts-ignore 
      socketIdRef.current = s.id;
    });

    s.on("ai:delta", (chunk: string) => {
      replyBufferRef.current += chunk;
      if (currentAssistantMsgIdRef.current) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === currentAssistantMsgIdRef.current
              ? { ...m, content: replyBufferRef.current }
              : m
          )
        );
      }
    });

    s.on("ai:done", () => {
      setIsTyping(false);
      replyBufferRef.current = "";
      currentAssistantMsgIdRef.current = null;
    });

    s.on("ai:error", () => {
      setIsTyping(false);
      replyBufferRef.current = "";
      currentAssistantMsgIdRef.current = null;
    });

    return () => {
      s.disconnect();
    };
  }, [socketUrl]);

  useEffect(() => {
    if (isOpen && welcome && !messages.length) {
      setMessages([{ id: crypto.randomUUID(), role: "assistant", content: welcome }]);
    }
  }, [isOpen, welcome, messages.length]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || !socketIdRef.current || isTyping) return;

    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);

    const aiMsgId = crypto.randomUUID();
    currentAssistantMsgIdRef.current = aiMsgId;
    setMessages((prev) => [...prev, { id: aiMsgId, role: "assistant", content: "" }]);

    setInput("");
    setIsTyping(true);

    try {
      await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socketId: socketIdRef.current,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: text },
          ],
        }),
      });
    } catch {
      setIsTyping(false);
    }
  }

  function stop() {
    setIsTyping(false);
    socketRef.current?.emit("ai:cancel");
  }

  const place = useMemo(() => {
    const sideClass = position === "bottom-right" ? "end-0" : "start-0";
    return { sideClass };
  }, [position]);


  return (
    <>
      <button
        aria-label={isOpen ? "Close chat" : "Open chat"}
        onClick={() => setIsOpen((v) => !v)}
        className={`btn btn-secondary rounded-circle position-fixed bottom-0 ${place.sideClass} m-3 shadow border`}
        style={{ width: 56, height: 56, fontSize: 24 , zIndex: 1080 }}
      >
        {isOpen ? "×" : <i className="bi bi-robot"></i>}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className={`position-fixed ${place.sideClass}  mb-5 m-3`}
          style={{ width: 360, maxWidth: "90vw", zIndex: 1080,  top: "120px" }}
        >
          <div className="card shadow-lg border-0" style={{ height: 480, maxHeight: "70vh" }}>
            <div className="card-header text-white d-flex justify-content-between align-items-center py-2" style={{backgroundColor: brandColor}}>
              
              <span className="fw-semibold"><span><i className="fw-bold  bi bi-robot"></i>   </span>{title}</span>
      
            </div>

            <div className="card-body p-2 d-flex flex-column border-top border-bottom" style={{ height: "100%" }}>
              <MessagesList messages={messages} />
            </div>

            <div className="card-footer p-2">
              <div className="d-flex align-items-end gap-2">
                <textarea
                  className="form-control rounded-3 flex-grow-1"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      isTyping ? stop() : sendMessage();
                    }
                  }}
                  placeholder="Write a message..."
                  rows={1}
                />
                <button
                  onClick={isTyping ? stop : sendMessage}
                  className={`btn  d-flex align-items-center justify-content-center ${
                    isTyping ? "btn-danger" : "btn-primary border-0"
                  }`}
                  aria-label={isTyping ? "Stop" : "Send"}
                >
                  {isTyping ? <i className="bi bi-stop-fill"></i> : <i className="bi bi-send"></i>}
                </button>
              </div>
              {isTyping && (
                <div className="text-center small text-muted mt-2">Assistant is typing...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MessagesList({
  messages,
}: {
  messages: { id: string; role: "user" | "assistant"; content: string }[];
}) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div ref={listRef} className="overflow-auto h-100 px-2">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`my-2 d-flex ${m.role === "user" ? "justify-content-end" : "justify-content-start"}`}
        >
          <div
          
            className={`px-3 py-2 rounded-3 shadow-sm ${
              m.role === "user" ? "text-white " : "bg-light text-dark border border-1"
            }`}
            style={{
              maxWidth: "85%",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              borderRadius: "1rem",
              ...(m.role === "user"
                ? { borderBottomRightRadius: "0.25rem",
                  backgroundColor: "#4ab0ff",
                 }
                : { borderBottomLeftRadius: "0.25rem" }),
            }}
          >
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}
