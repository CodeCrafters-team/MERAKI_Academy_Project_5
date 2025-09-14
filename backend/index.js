const express = require("express");
const app = express();
const PORT = 5000; 


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});