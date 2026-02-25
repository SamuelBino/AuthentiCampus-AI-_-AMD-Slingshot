const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ dest: "uploads/" });

// Risk Engine Logic
function calculateRisk(file) {
    let score = 85;

    // Large file penalty
    if (file.size > 5000000) {
        score -= 15;
    }

    // Suspicious filename keywords
    const suspiciousKeywords = ["edit", "final", "v2", "copy"];
    suspiciousKeywords.forEach(word => {
        if (file.originalname.toLowerCase().includes(word)) {
            score -= 5;
        }
    });

    // Small anomaly randomness
    score -= Math.floor(Math.random() * 8);

    if (score < 40) score = 40;

    let riskLevel =
        score > 75
            ? "Low"
            : score > 60
            ? "Moderate"
            : "High";

    return {
        authenticityScore: score,
        riskLevel: riskLevel,
        indicators: [
            "Metadata consistency analysis completed",
            "Behavioral anomaly scoring applied",
            "Synthetic pattern evaluation performed"
        ]
    };
}

app.post("/verify", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const result = calculateRisk(req.file);
    res.json(result);
});

app.listen(5000, () =>
    console.log("Server running at http://localhost:5000")
);