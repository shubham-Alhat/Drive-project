const express = require("express");
const userRouter = require("./routes/user.routes");
const dotenv = require("dotenv");
dotenv.config(); // now we can access .env variables.

const connectToDb = require("./config/db");
connectToDb(); // calling the function

// creating app
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.listen(8000, () => {
  console.log("Server is started at port 8000");
});
