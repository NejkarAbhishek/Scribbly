const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
//const userRoutes = require('./routes/userRoutes');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());


const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/IdeaBoard';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, family: 4,useUnifiedTopology: true })
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err => console.error(err));


//app.use("/api/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));