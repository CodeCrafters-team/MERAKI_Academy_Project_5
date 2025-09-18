'use client';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { listConversations, getMessages, sendMessage, startConversation } from "./../../api/chat";
import { joinConversation, leaveConversation, onChatMessage, onNewMessage, connectSocket } from "@/app/socket";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const THEME = "#77b0e4ff";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const toStr = (v:any) => (v==null ? "" : String(v));

const normalize = (m: any = {}) => ({
  ...m,
  _id: toStr(m._id ?? m.id ?? crypto.randomUUID()),
  sender: toStr(m.sender),
  conversation: toStr(m.conversation),
  createdAt: m.createdAt ?? new Date().toISOString(),
  text: m.text ?? "",
});

const normalizeFromSocket = (raw: any = {}) => {
  const r = raw?.message ?? raw;
  return {
    _id: toStr(r?._id ?? r?.id ?? crypto.randomUUID()),
    conversation: toStr(r?.conversation ?? r?.conversation_id ?? r?.conversationId ?? ""),
    sender: toStr(r?.sender ?? r?.user_id ?? r?.userId ?? ""),
    createdAt: r?.createdAt ?? r?.created_at ?? new Date().toISOString(),
    text: r?.text ?? "",
  };
};

const sortAsc = (arr: any[]) =>
  [...arr].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

export default function Chat() {
  const params = useParams<{ id?: string }>();
  const routeConvId = params?.id ? String(params.id) : "";
  const router = useRouter();

  const [meReady, setMeReady] = useState(false);
  const [myId, setMyId] = useState<string>("");
  const [myAvatar, setMyAvatar] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let uid = localStorage.getItem("userId");
    let av  = localStorage.getItem("avatar");
    if (!uid) { uid = "4"; localStorage.setItem("userId", uid); }
    if (!av)  { av  = "https://i.pravatar.cc/100?img=1"; localStorage.setItem("avatar", av); }
    setMyId(String(uid));
    setMyAvatar(av);
    setMeReady(true);
  }, []);

  const token = useSelector((state: any) => state.auth.token);

  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [errorConvs, setErrorConvs] = useState("");
  const [activeId, setActiveId] = useState(routeConvId || "");
  const [mobileView, setMobileView] = useState(!!routeConvId);

  const refreshConversations = useCallback(async () => {
    try {
      setLoadingConvs(true);
      const data = await listConversations();
      setConversations(data || []);
      setErrorConvs("");
    } catch (e: any) {
      setErrorConvs(e?.message || "Failed to load conversations");
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  const debouncedRefreshRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshConversationsDebounced = useCallback(() => {
    if (debouncedRefreshRef.current) clearTimeout(debouncedRefreshRef.current);
    debouncedRefreshRef.current = setTimeout(() => {
      refreshConversations().catch(() => {});
    }, 400);
  }, [refreshConversations]);

  useEffect(() => {
    connectSocket();
    refreshConversations().catch(() => {});
    const offNotify = onNewMessage(() => refreshConversationsDebounced());
    return () => { try { offNotify?.(); } catch {} };
  }, [refreshConversations, refreshConversationsDebounced]);

  useEffect(() => {
    if (routeConvId) { setActiveId(routeConvId); setMobileView(true); }
  }, [routeConvId]);

  const selectConversation = (id: string) => {
    setActiveId(id);
    if (routeConvId !== id) router.push(`/chat/${id}`);
    if (typeof window !== "undefined" && window.innerWidth < 992) setMobileView(true);
  };

  const handleStartChatWithUser = async (toUserId: string | number) => {
    try {
      const conv = await startConversation(toUserId);
      if (conv?._id) {
        selectConversation(conv._id);
        setMobileView(true);
        refreshConversations();
      }
    } catch {
      alert("Failed to start conversation");
    }
  };

  const activeConv = useMemo(
    () => conversations.find((c) => c._id === activeId),
    [conversations, activeId]
  );
  const otherUser = activeConv?.other || null;

  return (
    <div className="container-fluid mb-5" style={{ maxWidth: 1200 }}>
      <div className="row g-3 mt-3">
        <div className={`col-12 col-lg-4 ${mobileView ? "d-none d-lg-block" : ""}`}>
          <ConversationsPane
            conversations={conversations}
            loading={loadingConvs}
            error={errorConvs}
            activeId={activeId}
            onSelect={selectConversation}
            onRefresh={refreshConversations}
            onStartChat={handleStartChatWithUser}
            token={token || undefined}
          />
        </div>

        <div className={`col-12 col-lg-8 ${mobileView ? "" : "d-none d-lg-block"}`}>
          {!meReady ? (
            <div className="card p-5 text-center text-muted" style={{ height: "79.7vh" }}>
              Loading…
            </div>
          ) : activeId ? (
            <ChatWindow
              key={activeId}
              conversationId={activeId}
              onBack={() => setMobileView(false)}
              otherUser={otherUser}
              myAvatar={myAvatar}
              myId={myId}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationsPane({ conversations, loading, error, activeId, onSelect, onRefresh, onStartChat, token }: any) {
  return (
    <div className="card p-2" style={{ height: "79.7vh" }}>
      <div className="d-flex align-items-center justify-content-between px-2 pt-2 pb-1">
        <h5 className="m-0">Messages</h5>
    
      </div>

      <div className="px-2 pb-2">
        <UserSearch onStartChat={onStartChat} token={token} />
      </div>

      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {loading && <div className="p-3 text-muted">Loading…</div>}
        {error && <div className="p-3 text-danger">{error}</div>}
        {!loading && !conversations.length && (
          <div className="p-3 text-muted">No conversations.</div>
        )}
        {conversations.map((c: any) => (
          <ConvItem key={c._id} conv={c} active={c._id === activeId} onClick={() => onSelect(c._id)} />
        ))}
      </div>
    </div>
  );
}

function UserSearch({ onStartChat, token }: any) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: any) => { if (!boxRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const id = setTimeout(async () => {
      const term = q.trim();
      if (term.length < 2) { setResults([]); return; }
      setLoading(true);
      try {
        const res1 = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(term)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res1.ok) {
          const data = await res1.json();
          setResults((data.users || data || []).filter(Boolean));
        } else {
          const res2 = await fetch(`${BASE_URL}/users`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
          const d2 = await res2.json();
          const users = d2.users || d2 || [];
          const t = term.toLowerCase();
          setResults(users.filter((u: any) => {
            const full = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
            return full.includes(t) || (u.email || "").toLowerCase().includes(t);
          }).slice(0, 20));
        }
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(id);
  }, [q, token]);

  return (
    <div ref={boxRef} className="position-relative">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-search"></i></span>
        <input
          className="form-control"
          placeholder="Search users to start a chat…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {!!q && (
          <button className="btn btn-outline-secondary" type="button" onClick={() => { setQ(""); setResults([]); }}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>

      {open && q.trim().length >= 2 && (
        <div className="card position-absolute w-100 mt-1" style={{ zIndex: 10, maxHeight: 320, overflowY: "auto" }}>
          {loading && <div className="p-2 text-muted small">Searching…</div>}
          {!loading && !results.length && <div className="p-2 text-muted small">No users found.</div>}
          {results.map((u: any) => (
            <button
              key={u.id}
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => { setOpen(false); setQ(""); setResults([]); onStartChat?.(u.id); }}
            >
              <img src={u.avatarUrl || "https://via.placeholder.com/36x36?text=U"} alt="" className="rounded-circle" style={{ width: 36, height: 36, objectFit: "cover" }} />
              <div className="text-start">
                <div className="fw-semibold">{(u.firstName || "") + " " + (u.lastName || "")}</div>
                <div className="small text-muted">{u.email || ""}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConvItem({ conv, active, onClick }: any) {
  const other = conv.other || {};
  const lastText = conv?.lastMessage?.text || "";
  return (
    <div className={`d-flex gap-2 align-items-center p-2 rounded ${active ? "bg-light" : ""}`} role="button" onClick={onClick}>
      <img src={other.avatarUrl || "https://via.placeholder.com/48x48?text=U"} alt="" className="rounded-circle" style={{ width: 48, height: 48, objectFit: "cover" }} />
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
          <div className="fw-semibold">{(other.firstName || "") + " " + (other.lastName || "")}</div>
        </div>
        <div className="text-muted small text-truncate" style={{ maxWidth: 260 }}>{lastText}</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card p-5 text-center text-muted" style={{ height: "79.7vh" }}>
      <i className="bi bi-chat-left-text display-4 mb-2"></i>
      <div>Select a conversation</div>
    </div>
  );
}

function ChatWindow({
  conversationId,
  onBack,
  otherUser,
  myAvatar,
  myId
}: {
  conversationId: string;
  onBack?: () => void;
  otherUser?: any;
  myAvatar?: string | null;
  myId: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    joinConversation(conversationId);
    return () => leaveConversation(conversationId);
  }, [conversationId]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getMessages(conversationId, { offset: 0, limit: 50 });
        const items = (data.items || []).map(normalize);
        setMessages(sortAsc(items));
        setNextCursor(data.nextCursor || null);
        setError("");
        setTimeout(() => listRef.current?.lastElementChild?.scrollIntoView({ block: "end" }), 0);
      } catch (e: any) {
        setError(e?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    })();
  }, [conversationId]);

  useEffect(() => {
    const handle = (raw: any) => {
      const incoming = normalizeFromSocket(raw);
      if (!incoming.conversation || toStr(incoming.conversation) !== toStr(conversationId)) return;

      setMessages(prev => {
        const idx = prev
          .slice()                   
          .reverse()                    
          .findIndex(m =>
            m.pending &&
            toStr(m.conversation) === toStr(conversationId) &&
            m.text === incoming.text
          );
        const realIdx = idx === -1 ? -1 : (prev.length - 1 - idx);

        if (realIdx !== -1) {
          const old = prev[realIdx];
          const merged = {
            ...old,           
            ...incoming,
            sender: old.sender, 
            pending: false
          };
          const copy = prev.slice();
          copy[realIdx] = merged;
          return sortAsc(copy);
        }

        if (incoming._id && prev.some(m => m._id === incoming._id)) return prev;

        if (!incoming.sender) return prev;

        return sortAsc([...prev, incoming]);
      });

      setTimeout(() => listRef.current?.lastElementChild?.scrollIntoView({ block: "end", behavior: "smooth" }), 50);
    };

    const off = onChatMessage(handle);
    return () => { try { off?.(); } catch {} };
  }, [conversationId]);

  async function loadOlder() {
    if (!nextCursor || loading) return;
    try {
      setLoading(true);
      const data = await getMessages(conversationId, nextCursor);
      const items = (data.items || []).map(normalize);
      setMessages(prev => sortAsc([...items, ...prev]));
      setNextCursor(data.nextCursor || null);
    } finally {
      setLoading(false);
    }
  }

  const onSend = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    const tempId = `tmp-${Date.now()}`;
    const optimistic = normalize({
      _id: tempId,
      conversation: conversationId,
      sender: myId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      pending: true,
    });
    setMessages(prev => sortAsc([...prev, optimistic]));
    setTimeout(() => listRef.current?.lastElementChild?.scrollIntoView({ block: "end", behavior: "smooth" }), 0);

    try {
      const res = await sendMessage({ conversationId, text: text.trim() });
      const real = normalize(res?.message || {});
      setMessages(prev => {
        const idx = prev.findIndex(m => m._id === tempId);
        if (idx !== -1) {
          const copy = prev.slice();
          copy[idx] = sortAsc([{ ...prev[idx], ...real, sender: prev[idx].sender, pending: false }])[0];
          return sortAsc(copy);
        }
        if (!prev.some(m => m._id === real._id)) return sortAsc([...prev, real]);
        return prev;
      });
    } catch {
      setMessages(prev => prev.filter(m => m._id !== tempId));
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const otherAvatar = otherUser?.avatarUrl || "https://via.placeholder.com/28x28?text=U";
  const myAvatarSrc = myAvatar || "https://via.placeholder.com/28x28?text=Me";

  return (
    <div className="card" style={{ height: "79.7vh", display: "flex" }}>
      <div className="d-flex align-items-center border-bottom p-2">
        <button className="btn btn-link d-lg-none me-2" onClick={onBack}>
          <i className="bi bi-arrow-left"></i>
        </button>
        {otherUser ? (
          <div className="d-flex align-items-center gap-2">
            <img src={otherAvatar} alt="" className="rounded-circle" style={{ width: 32, height: 32, objectFit: "cover" }} />
            <h6 className="m-0">{(otherUser.firstName || "") + " " + (otherUser.lastName || "")}</h6>
          </div>
        ) : (<h6 className="m-0">Conversation</h6>)}
      </div>

      <div className="flex-grow-1 p-2" style={{ overflowY: "auto" }} ref={listRef}>
        {loading && <div className="text-muted small p-2">Loading…</div>}
        {error && <div className="text-danger small p-2">{error}</div>}

        {!!nextCursor && (
          <div className="d-flex">
            <button className="btn btn-sm btn-outline-secondary ms-auto me-auto mb-2" onClick={loadOlder} disabled={loading}>
              Load older
            </button>
          </div>
        )}

        {!!messages.length && messages.map((m) => (
          <MessageBubble key={m._id} msg={m} isMine={toStr(m.sender) === toStr(myId)} myAvatar={myAvatarSrc} otherAvatar={otherAvatar} />
        ))}
      </div>

      <div className="border-top p-2">
        <Composer onSend={onSend} disabled={sending} />
      </div>
    </div>
  );
}

function MessageBubble({ msg, isMine, myAvatar, otherAvatar }: any) {
  if (isMine) {
    return (
      <div className="d-flex justify-content-end align-items-end gap-2 mb-2">
        <div className="px-3 py-2" style={{ maxWidth: "75%", borderRadius: 12, background: THEME, color: "#fff", opacity: msg.pending ? 0.6 : 1 }} title={new Date(msg.createdAt).toLocaleString()}>
          {msg.text}
        </div>
        <img src={myAvatar} alt="" className="rounded-circle" style={{ width: 28, height: 28, objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div className="d-flex justify-content-start align-items-end gap-2 mb-2">
      <img src={otherAvatar} alt="" className="rounded-circle" style={{ width: 28, height: 28, objectFit: "cover" }} />
      <div className="px-3 py-2" style={{ maxWidth: "75%", borderRadius: 12, background: "#f1f3f5", color: "#000" }} title={new Date(msg.createdAt).toLocaleString()}>
        {msg.text}
      </div>
    </div>
  );
}

function Composer({ onSend, disabled }: any) {
  const [text, setText] = useState("");
  const onKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && text.trim()) {
        onSend(text);
        setText("");
      }
    }
  };
  return (
    <div className="d-flex gap-2">
      <textarea
        className="form-control"
        rows={1}
        placeholder="Write a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        style={{ resize: "none" }}
        disabled={disabled}
      />
      <button className="btn" style={{ background: THEME, color: "#fff" }}
        onClick={() => { if (text.trim()) { onSend(text); setText(""); } }}
        disabled={disabled || !text.trim()}>
        <i className="bi bi-send"></i>
      </button>
    </div>
  );
}
