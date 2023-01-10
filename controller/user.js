const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { validateEmail, validateLength } = require("../helpers/validations");
const { generateToken } = require("../helpers/token");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({
      message: "invalid email address",
    });
  }
  const check = await User.findOne({ email });
  if (check) {
    return res.status(400).json({
      message: "This is email address alredy exist",
    });
  }
  if (!validateLength(password, 5, 15)) {
    return res.status(400).json({
      message: "password must be atleast 5 charecter",
    });
  }
  const cryptedPassword = await bcrypt.hash(password, 10);
  const user = await new User({
    name,
    email,
    password: cryptedPassword,
  }).save();
  const token = generateToken({ id: user._id.toString() }, "2d");
  res.json({
    id: user._id,
    name: user.name,
    token: token,
    message: "Registration completed successfully",
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "This email address is not connected",
    });
  }
  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    return res.status(400).json({
      message: "Invalid credential pls try again.",
    });
  }
  const token = generateToken({ id: user._id.toString() }, "2d");
  res.json({
    id: user._id,
    name: user.name,
    token: token,
  });
});
