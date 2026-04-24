const express = require("express");
const cors = require("cors");
const processData = require("./processor");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Replace with your details
const USER_ID = "harsh_01012000";
const EMAIL = "your_email@srmist.edu";
const ROLL = "YOUR_ROLL_NUMBER";

app.post("/bfhl", (req, res) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input" });
        }

        const result = processData(data);

        res.json({
            user_id: USER_ID,
            email_id: EMAIL,
            college_roll_number: ROLL,
            ...result
        });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});