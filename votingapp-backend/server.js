const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();

app.use(cors({
  origin: "*", 
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Voting App Backend is running 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const UserRoutes = require("./routes/UserRoutes");
const CandidateRoutes = require("./routes/CandidateRoute");
const VotingRoutes = require("./routes/VotingRoute");

app.use("/user", UserRoutes);
app.use("/candidate", CandidateRoutes);
app.use("/vote", VotingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
