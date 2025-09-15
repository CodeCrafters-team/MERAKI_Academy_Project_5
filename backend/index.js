const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db");

const app = express();
const PORT = 5000;

// Import Routers
const usersRouter = require("./routes/users");
const rolesRouter = require("./routes/roles");
const modulesRouter = require("./routes/modules");
const categoriesRouter = require("./routes/categories");
const coursesRouter = require("./routes/courses");
const lessonsRouter=require("./routes/lessons")
const enrollmentRouter=require("./routes/enrollments")

app.use(cors());
app.use(express.json());

// Routes 
app.use("/users", usersRouter);
app.use("/roles", rolesRouter);
app.use("/modules", modulesRouter);
app.use("/categories", categoriesRouter);
app.use("/courses", coursesRouter);
app.use("/lessons", lessonsRouter);
app.use("/enrollment", enrollmentRouter);


// Handles any other endpoints [unassigned - endpoints]
app.use((req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
