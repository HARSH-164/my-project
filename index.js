const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Server is running successfully");
});

app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from API" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});