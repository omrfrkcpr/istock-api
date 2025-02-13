"use strict";

/* ---------------------------------- */
/*             ISTOCK API             */
/*         Database Connection        */
/* ---------------------------------- */

const express = require("express");
const app = express();
const cors = require("cors");

/* -------------------------------------------- */

// envVariables to process.env:
require("dotenv").config();
const HOST = process.env?.HOST || "127.0.0.1";
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require("express-async-errors");

/* -------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* -------------------------------------------- */
// Middlewares:

const corsOptions = {
  origin: [process.env.CLIENT_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "HEAD", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Accept JSON:
app.use(express.json());

// Check Authentication:
app.use(require("./src/middlewares/authentication"));

// Run Logger:
// app.use(require("./src/middlewares/logger"));

// res.getModelList():
app.use(require("./src/middlewares/queryHandler"));

/* -------------------------------------------- */
// Routes:

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to ISTOCK API",
    documents: {
      swagger: "/documents/swagger",
      redoc: "/documents/redoc",
      json: "/documents/json",
    },
    user: req.user,
  });
});

// Routes:
app.use(require("./src/routes"));

/* -------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`));

/* -------------------------------------------- */
// Syncronization (must be in commentLine):
// require("./src/helpers/sync")(); // !!! It clears database.
