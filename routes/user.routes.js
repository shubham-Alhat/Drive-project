const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const dotenv = require("dotenv");
dotenv.config();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("password").trim().isLength({ min: 5 }),
  body("username").trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid data" });
    }
    const { username, password, email } = req.body;
    console.log(username, password, email);
    const hashPassword = await bcrypt.hash(password, 10);

    console.log(`password: ${password} and its hashed form: ${hashPassword}`);

    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    res.json(newUser);
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid data" });
    }

    const { username, password } = req.body;
    console.log(username, password); //

    const user = await userModel.findOne({
      username: username,
    });
    console.log(user); //
    if (!user) {
      return res.status(400).json({
        message: "username is incorrect",
      });
    }
    console.log(password, "this is from DB");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({
        message: `password is incorrect ${password} ==/ ${user.password}`,
      });
    }

    // generating token using jwt
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET
    );

    res.json(token);
  }
);

module.exports = router;

// // final route ---------   /user/test
// router.get("/test", (req, res) => {
//   res.send("user test route");
// });
