const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const bodyparser = require('body-parser')
app.use(bodyparser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});  

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cors());


const UserRoutes = require('./routes/UserRoutes');
const CandidateRoutes = require('./routes/CandidateRoute');
const VotingRoutes = require('./routes/VotingRoute');

app.use('/user', UserRoutes);
app.use('/candidate',CandidateRoutes);
app.use('/vote',VotingRoutes);