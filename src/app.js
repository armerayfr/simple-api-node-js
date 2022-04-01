const cors = require("cors");
const express = require("express");
const axios = require("axios");

const logger = require("./utils/logger");
const httpLogger = require("./utils/httpLogger");
const Api404Error = require("./utils/Error/api404Error");
const {
  logError,
  returnError,
  isOperationalError,
} = require("./utils/errorHandler");

const app = express();

app.use(httpLogger);
app.use(cors());
app.use(express.json());

app.post("/login", (req, res, next) => {
  //static data
  const user = {
    username: "armerray",
    password: "nodejs123$!",
  };

  const { username, password } = req.body;
  const isMatch = user.username === username && user.password === password;

  try {
    if (!isMatch) {
      throw new Api404Error("your username or password invalid");
    }

    res.status(200).send("success login");
  } catch (err) {
    next(err);
  }
});

app.get("/jobs", async (req, res, next) => {
  let url = "http://dev3.dansmultipro.co.id/api/recruitment/positions.json?";
  const { description, location, full_time } = req.query;

  try {
    if (description !== undefined) url += `description=${description}&`;
    if (location !== undefined) url += `location=${location}&`;
    if (full_time !== undefined) url += `full_time=${full_time}`;

    const jobList = await axios.get(url);

    res.status(200).send(jobList.data);
  } catch (err) {
    next(err);
  }
});

app.get("/job/:id", async (req, res, next) => {
  try {
    const url = `http://dev3.dansmultipro.co.id/api/recruitment/positions/${req.params.id}`;
    const job = await axios.get(url);

    if (job.data.id === undefined) {
      throw new Api404Error("id not match");
    }

    res.status(200).send(job.data);
  } catch (err) {
    next(err);
  }
});

// if the Promise is rejected this will catch it
process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", (error) => {
  logError(error);

  if (!isOperationalError(error)) {
    process.exit(1);
  }
});

app.use(logError);
app.use(returnError);

module.exports = app;
