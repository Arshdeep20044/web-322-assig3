require("dotenv").config();
console.log("MONGO:", process.env.MONGO_URI);
console.log("POSTGRES:", process.env.POSTGRES_HOST);
console.log("SECRET:", process.env.SESSION_SECRET);

const PORT = process.env.PORT || 8000;

const express = require("express");
const session = require("client-sessions");
const path = require("path");

const mongoConnection = require("./config/mongo");
const { sequelize } = require("./config/postgres");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 60 * 1000,
  })
);

app.use("/", authRoutes);
app.use("/", taskRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`));

  })
  .catch((err) => console.log(err));
