const express = require("express");
const passport = require("passport");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/google");
require("dotenv").config();
require("./models/db");


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

require("./socket").init(io);

const PORT = 5000;

const googleRoutes = require("./routes/google");
const usersRouter = require("./routes/users");
const rolesRouter = require("./routes/roles");
const modulesRouter = require("./routes/modules");
const categoriesRouter = require("./routes/categories");
const coursesRouter = require("./routes/courses");
const lessonsRouter = require("./routes/lessons");
const enrollmentRouter = require("./routes/enrollments");
const conversationsRouter = require("./routes/conversations");
const messagesRouter = require("./routes/messages");
const setupGoogleStrategy = require("./config/googleStrategy");
const reviewRouter = require("./routes/reviews")
const progressRouter = require("./routes/progress")
const contactRouter = require("./routes/contacts"); 
const paymentsRouter = require("./routes/payments"); 




app.use(cors());
app.use(express.json());
setupGoogleStrategy();
app.use(passport.initialize());



app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/modules", modulesRouter);
app.use("/categories", categoriesRouter);
app.use("/courses", coursesRouter);
app.use("/lessons", lessonsRouter);
app.use("/enrollments", enrollmentRouter);
app.use("/conversations", conversationsRouter);
app.use("/messages", messagesRouter);
app.use("/auth/google", googleRoutes)
app.use("/reviews", reviewRouter)
app.use("/progress", progressRouter)
app.use("/contact", contactRouter); 
app.use("/payments", paymentsRouter); 






app.use((req, res) => res.status(404).json("NO content at this path"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("login", (userId) => {
    console.log("User logged in:", userId);
    socket.userId = Number(userId);
    socket.join(`user_${userId}`);
  });

  socket.on("join_conversation", (conversationId) => {
    console.log("User joined conversation:", conversationId);
    socket.join(`conversation_${conversationId}`);
  });

  socket.on("leave_conversation", (conversationId) => {
    console.log("User left conversation:", conversationId);
    socket.leave(`conversation_${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
//*******************************************************//
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(passport.initialize());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server running!");
});




httpServer.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
