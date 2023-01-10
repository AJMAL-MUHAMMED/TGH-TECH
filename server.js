const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const todoRouter = require("./routes/todoRouter.js");
const path = require("path");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan("dev"));

app.use("/api", todoRouter);
app.use("/test", (req, res) => {
  res.render("login");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
app.use(errorHandler);

/////////////////   Database connect //////////////////
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DBURL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected successfull"))
  .catch((err) => console.logI("error connecting to mongodb", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
