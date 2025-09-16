const { pool } = require("../models/db");

const createConversation = (req, res) => {
  const currentUserId = req.user.id;
  const participantIds =  req.body.participantIds 

  if (!currentUserId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (participantIds.length === 0) {
    return res.status(400).json({ success: false, message: "participantIds required" });
  }

  pool
    .query(`INSERT INTO conversations DEFAULT VALUES RETURNING id, created_at`)
    .then((conv) => {
      const conversationId = conv.rows[0].id;
      const uniqueIds = Array.from(new Set([currentUserId, ...participantIds]));
      const values = uniqueIds.map((_, i) => `($1, $${i + 2})`).join(", ");
      return pool
        .query(
          `INSERT INTO conversation_participants (conversation_id, user_id)
           VALUES ${values}
           ON CONFLICT DO NOTHING`,
          [conversationId, ...uniqueIds]
        )
        .then(() => {
          res.status(201).json({ success: true, data: { id: conversationId } });
        });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Server Error", error: err.message });
    });
};

const listMyConversations = (req, res) => {
  const currentUserId = req.user && req.user.id;
  if (!currentUserId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const sql = `
    WITH my_convs AS (
      SELECT c.id
      FROM conversations c
      JOIN conversation_participants cp ON cp.conversation_id = c.id
      WHERE cp.user_id = $1
    ),
    last_msg AS (
      SELECT m.conversation_id, m.id, m.text, m.user_id, m.created_at,
             ROW_NUMBER() OVER (PARTITION BY m.conversation_id ORDER BY m.created_at DESC) AS rn
      FROM messages m
      WHERE m.conversation_id IN (SELECT id FROM my_convs)
    ),
    unread AS (
      SELECT m.conversation_id, COUNT(*) AS unread_count
      FROM messages m
      WHERE m.conversation_id IN (SELECT id FROM my_convs)
        AND m.user_id <> $1
        AND m.read_at IS NULL
      GROUP BY m.conversation_id
    )
    SELECT
      mc.id AS conversation_id,
      COALESCE(u2.unread_count, 0) AS unread_count,
      lm.id   AS last_message_id,
      lm.text AS last_message_text,
      lm.user_id AS last_message_user_id,
      lm.created_at AS last_message_created_at
    FROM my_convs mc
    LEFT JOIN (SELECT * FROM last_msg WHERE rn = 1) lm ON lm.conversation_id = mc.id
    LEFT JOIN unread u2 ON u2.conversation_id = mc.id
    ORDER BY COALESCE(lm.created_at, '1970-01-01') DESC
  `;

  pool
    .query(sql, [currentUserId])
    .then((result) => {
      res.json({ success: true, data: result.rows });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Server Error", error: err.message });
    });
};

module.exports = { createConversation, listMyConversations }; 