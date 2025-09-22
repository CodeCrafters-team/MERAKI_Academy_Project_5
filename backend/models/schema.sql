CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user1_id INT NOT NULL REFERENCES users(id),
  user2_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Contact (
  id SERIAL PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
