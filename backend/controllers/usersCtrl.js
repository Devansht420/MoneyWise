const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const JWT_SECRET = process.env.JWT_SECRET || "moneyWiseKey";

const usersController = {
  // register a new user
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // validate required fields
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please provide username, email, and password");
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // hash password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),

  // login existing user
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid login credentials");
    }

    // compare plaintext with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid login credentials");
    }

    // generate jwt token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      message: "Login success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  // get current user profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({ username: user.username, email: user.email });
  }),

  // change current user password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      res.status(400);
      throw new Error("New password is required");
    }

    const user = await User.findById(req.user);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // hash new password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    await user.save({
      validateBeforeSave: false,
    });

    res.json({ message: "Password changed successfully" });
  }),

  // update current user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({ message: "User profile updated successfully", updatedUser });
  }),
};

module.exports = usersController;
