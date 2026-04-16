const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mern-expenses";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// connect to mongodb
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

// cors config
const corsOptions = {
  origin: [CLIENT_URL],
};
app.use(cors(corsOptions));
// middlewares
app.use(express.json());
// routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);
// error handler
app.use(errorHandler);

// start the server
app.listen(PORT, () =>
  console.log(`Server is running on this port... ${PORT} `)
);
