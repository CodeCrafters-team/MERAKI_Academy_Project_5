'use client';
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000", {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  const uid = typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null;
  if (uid) s.emit("login", Number(uid));
  return s;
}

export function joinConversation(conversationId: string | number) {
  getSocket().emit("join_conversation", Number(conversationId));
}
export function leaveConversation(conversationId: string | number) {
  getSocket().emit("leave_conversation", Number(conversationId));
}

export function onChatMessage(cb: (payload: any) => void) {
  const s = getSocket();
  const handler = (payload: any) => cb(payload);
  s.on("new_message", handler);
  s.on("message_notification", handler);

  return () => s.off("new_message", handler);
}

export function onNewMessage(cb: (payload: any) => void) {
  const s = getSocket();
  const handler = (payload: any) => cb(payload);
  s.on("message_notification", handler);
  s.on("new_message", handler);

  return () => s.off("message_notification", handler);
}
