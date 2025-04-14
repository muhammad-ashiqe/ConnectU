import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isAlreadyUser = await User.findOne({ email });

    if (isAlreadyUser) {
      return res.status(409).json({
        message: "User already registered, please login to continue",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    const userResponse = {
      id: newUser._id,
      name:newUser.name,
      email: newUser.email,
    };

    return res.status(201).json({
      message: "User registration successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

//login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found, please register first",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    const userResponse = {
      id: user._id,
      name:user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

//search user
const searchUser = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).select('-password')
    .find({_id :{$ne : req.user.id}});
    res.json({ message: "user found", users });
  } catch (error) {
    res.json({ message: "error occured" });
  }
};

export { registerUser, login, searchUser };
