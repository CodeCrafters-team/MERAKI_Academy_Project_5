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

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE  course_progress (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT  NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  lesson_id  BIGINT  NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (user_id, lesson_id)
);