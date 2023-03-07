const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");

dotenv.config();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const mypath = path.join(__dirname, "dist");
console.log(mypath);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("DB Connection Successfull"))
//   .then(() =>
//     app.listen(PORT, () => {
//       console.log("Backend server is Running");
//     })
//   )
//   .catch((err) => {
//     console.error(err);
//   });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Serve the React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/test", (req, res) => {
  res.send("hello");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Backend server is Running");
  });
});
// app.listen(PORT, () => {
//   console.log("Backend server is Running");
// });

module.exports = app;
