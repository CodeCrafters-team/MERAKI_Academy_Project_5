'use client';

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://meraki-academy-project-5-anxw.onrender.com";
const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json", 
});

export async function listConversations() {
  const res = await fetch(`${API}/conversations`, { headers: auth() });
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);
  const { data } = await res.json();

 
  return (data || []).map((row: any) => ({
    _id: String(row.conversation_id),
    other: {
      _id: String(row.other_user_id),
      firstName: row.other_user_first_name,
      lastName: row.other_user_last_name,
      avatarUrl: row.other_user_avatar_url ?? null, 
      email: row.other_user_email ?? "",
    },
    unreadCount: Number(row.unread_count) || 0,
    lastMessage: row.last_message_id ? {
      _id: String(row.last_message_id),
      text: row.last_message_text,
      sender: String(row.last_message_user_id),
      createdAt: row.last_message_created_at,
    } : null,
  }));
}

export async function getMessages(conversationId: string | number, cursor?: { offset?: number, limit?: number }) {
  const limit = cursor?.limit ?? 50;
  const offset = cursor?.offset ?? 0;
  const res = await fetch(`${API}/messages/${conversationId}?limit=${limit}&offset=${offset}`, { headers: auth() });
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);
  const r = await res.json();

  const items = (r.data || []).map((m: any) => ({
    _id: String(m.id),
    conversation: String(conversationId),
    sender: String(m.userId),
    recipient: null,
    text: m.text,
    createdAt: m.createdAt,
    readAt: m.readAt,
  }));

  const total = Number(r.pagination?.total ?? 0);
  const nextOffset = offset + limit;
  return {
    items,
    nextCursor: nextOffset < total ? { offset: nextOffset, limit } : null,
  };
}

export async function sendMessage({ conversationId, text }: { conversationId: string | number, text: string }) {
  const res = await fetch(`${API}/messages/${conversationId}`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);
  const r = await res.json();
  const m = r.data;

  return {
    message: {
      _id: String(m.id),
      conversation: String(m.conversation_id),
      sender: String(m.user_id),
      text: m.text,
      createdAt: m.created_at,
      readAt: m.read_at,
    }
  };
}

export async function startConversation(toUserId: string | number) {
  const res = await fetch(`${API}/conversations`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify({ participantIds: [Number(toUserId)] }),
  });
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);
  const r = await res.json();
  return { _id: String(r.data.id), existing: !!r.data.existing };
}
