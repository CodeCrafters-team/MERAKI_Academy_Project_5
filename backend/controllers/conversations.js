const { pool } = require("../models/db");

const createConversation = (req, res) => {
  const currentUserId = req.user.id;
  const participantIds = req.body.participantIds;

  if (!currentUserId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (participantIds.length === 0) {
    return res.status(400).json({ success: false, message: "participantIds required" });
  }

  const otherUserId = participantIds[0];

  pool.query(
    `SELECT id FROM conversations 
     WHERE (user1_id = $1 AND user2_id = $2)
     OR (user1_id = $2 AND user2_id = $1)`,
    [currentUserId, otherUserId]
  )
  .then((result) => {
    if (result.rows.length > 0) {
      return res.status(200).json({ 
        success: true, 
        data: { 
          id: result.rows[0].id,
          existing: true 
        } 
      });
    }

    return pool
      .query(
        `INSERT INTO conversations (user1_id, user2_id) 
         VALUES ($1, $2) 
         RETURNING id, created_at`,
        [currentUserId, otherUserId]
      )
      .then((result) => {
        res.status(201).json({ 
          success: true, 
          data: { 
            id: result.rows[0].id,
            existing: false 
          } 
        });
      });
  })
  .catch((err) => {
    if (err.code === '23505') {
      return res.status(400).json({
        success: false,
        message: "Conversation already exists between these users"
      });
    }
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
      SELECT 
        c.id,
        CASE 
          WHEN c.user1_id = $1 THEN c.user2_id
          ELSE c.user1_id
        END as other_user_id
      FROM conversations c
      WHERE c.user1_id = $1 OR c.user2_id = $1
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
      mc.other_user_id,
      u.first_name as other_user_first_name,
      u.last_name as other_user_last_name,
      u.avatar_url as other_user_avatar_url,
      COALESCE(u2.unread_count, 0) AS unread_count,
      lm.id   AS last_message_id,
      lm.text AS last_message_text,
      lm.user_id AS last_message_user_id,
      lm.created_at AS last_message_created_at
    FROM my_convs mc
    JOIN users u ON u.id = mc.other_user_id
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