const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const authRoutes = require("./routes/auth.route");
const blogRouter = require("./routes/blog.route");

const db = require("./db");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// connect to MongoDB
db.connect_to_mongoDB();

// home route
app.get("/", (req, res) => {
  res.send("Boluwatiiife's blogApi");
});

app.use("/auth", authRoutes);
app.use("/blog", blogRouter);

// global error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
