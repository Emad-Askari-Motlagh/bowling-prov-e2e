const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cardRoutes = require("./routes/cardRoutes");
const app = express();
const path = require("path");

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started Successfully.");
  }
});
//Bm1uqBx4noLvBwyU
mongoose
  .connect(
    "mongodb+srv://emadaskari:Bm1uqBx4noLvBwyU@cluster0.afpwnua.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
// app.use(express.static(path.join(__dirname, "/../frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
// });
app.use("/", authRoutes);
app.use("/", cardRoutes);
