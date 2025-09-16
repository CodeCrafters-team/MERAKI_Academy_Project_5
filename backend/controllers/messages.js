const { pool } = require("../models/db");
const { getIo } = require("../socket");

const sendMessage = (req, res) => {
  const currentUserId = req.user && req.user.id;
  console.log("Current User ID:", currentUserId);
  const conversationId = Number(req.params.id);
  const { text } = req.body;

  if (!currentUserId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!conversationId) {
    return res.status(400).json({ success: false, message: "Invalid conversation id" });
  }
  if (!text) {
    return res.status(400).json({ success: false, message: "text required" });
  }

  let otherUserId;

  pool
    .query(
      `SELECT * FROM conversations 
       WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [conversationId, currentUserId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Not a participant in this conversation",
        });
      }

      const conv = result.rows[0];
      otherUserId =
        conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;

      return pool.query(
        `SELECT first_name, last_name, avatar_url 
         FROM users 
         WHERE id = $1`,
        [currentUserId]
      ).then(userResult => {
        const userData = userResult.rows[0];
        
        return pool.query(
          `INSERT INTO messages (conversation_id, user_id, text)
           VALUES ($1, $2, $3)
           RETURNING id, conversation_id, user_id, text, created_at, read_at`,
          [conversationId, currentUserId, text]
        ).then(insertResult => {
          return {
            messageData: insertResult.rows[0],
            userData: userData
          };
        });
      });
    })
    .then((result) => {
      if (!result) return;
      const { messageData: newMessage, userData } = result;

      const io = getIo();

      io.to(`conversation_${conversationId}`).emit("new_message", {
        ...newMessage,
        sender: {
          id: currentUserId,
          firstName: userData.first_name,
          lastName: userData.last_name,
          avatarUrl: userData.avatar_url
        },
      });

      const room = io.sockets.adapter.rooms.get(
        `conversation_${conversationId}`
      );
      let recipientInRoom = false;

      if (room && room.size > 0) {
        for (const sid of room) {
          const s = io.sockets.sockets.get(sid);
          if (s && Number(s.userId) === Number(otherUserId)) {
            recipientInRoom = true;
            break;
          }
        }
      }

      if (!recipientInRoom) {
        io.to(`user_${otherUserId}`).emit("message_notification", {
     ...newMessage,
        sender: {
          id: currentUserId,
          firstName: userData.first_name,
          lastName: userData.last_name,
          avatarUrl: userData.avatar_url
        },
        });
      }

      return res.status(201).json({
        success: true,
        data: newMessage,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", error: err.message });
    });
};

const listMessages = (req, res) => {
  const currentUserId = req.user && req.user.id;
  console.log("Current User ID:", currentUserId);
  const conversationId = Number(req.params.id);
  const limit = req.query.limit;
  const offset = req.query.offset;

  if (!currentUserId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!conversationId || Number.isNaN(conversationId)) {
    return res.status(400).json({ success: false, message: "Invalid conversation id" });
  }

  pool
    .query(
      `SELECT * FROM conversations 
       WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [conversationId, currentUserId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Not a participant in this conversation",
        });
      }

      return pool
        .query(
          `UPDATE messages 
           SET read_at = NOW() 
           WHERE conversation_id = $1 
             AND user_id != $2 
             AND read_at IS NULL
           RETURNING id`,
          [conversationId, currentUserId]
        )
        .then(() => {
          return pool.query(
            `SELECT 
              m.id,
              m.user_id,
              m.text,
              m.created_at,
              m.read_at,
              u.first_name,
              u.last_name,
              u.avatar_url
            FROM messages m
            JOIN users u ON u.id = m.user_id
            WHERE m.conversation_id = $1
            ORDER BY m.created_at DESC
            LIMIT $2 OFFSET $3`,
            [conversationId, limit || 50, offset || 0]
          );
        });
    })
    .then((result) => {
      if (!result) return;
      const data = result.rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        text: r.text,
        createdAt: r.created_at,
        readAt: r.read_at,
        sender: {
          id: r.user_id,
          firstName: r.first_name,
          lastName: r.last_name,
          avatarUrl: r.avatar_url,
        },
        isMine: r.user_id === currentUserId,
      }));

      return pool
        .query(`SELECT COUNT(*) as total FROM messages WHERE conversation_id = $1`, [conversationId])
        .then((countResult) => {
          const total = parseInt(countResult.rows[0].total);
          return res.json({
            success: true,
            data,
            pagination: { limit, offset, total },
          });
        });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", error: err.message });
    });
};

module.exports = { sendMessage, listMessages };
