import User from "../models/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export function saveUser(req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    role: req.body.role,
    phone: req.body.phone,
  });

  user
    .save()
    .then(() => {
      console.log(user);
      return res.status(200).json({
        message: "User saved successfully",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Error saving user",
      });
    });
}

export async function googleLogin(req, res) {
  const accessToken = req.body.accessToken;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const user = await User.findOne({ email: response.data.email });

    if (user) {
      // 🔒 Prevent login if user is disabled
      if (user.isDisabled) {
        return res.status(403).json({
          message: "This account is disabled. Please contact admin.",
        });
      }

      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        isDisabled: user.isDisabled,
        isEmailVerified: user.isEmailVerified,
      };

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "48hrs",
      });

      return res.json({
        message: "Login successful",
        token,
        user: userData,
      });
    } else {
      // 👤 Create new user if not found
      const newUser = new User({
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        isEmailVerified: true,
        role: response.data.role,
        password: accessToken, // temporary, since Google handles auth
      });

      await newUser.save();

      const userData = {
        email: response.data.email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        role: "user",
        phone: "Not given",
        isDisabled: false,
        isEmailVerified: true,
      };

      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "48hrs",
      });

      res.json({
        message: "Login successful",
        token,
        user: userData,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Google login failed",
    });
  }
}

export function loginUser(req, res) {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "Email not found",
        });
      }
      if (user.isDisabled) {
        return res.status(403).json({
          message: "This account is disabled. Please contact admin.",
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (isPasswordCorrect) {
        const userData = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isDisabled: user.isDisabled,
          isEmailVerified: user.isEmailVerified,
        };

        const token = jwt.sign(userData, process.env.JWT_SECRET);

        return res.json({
          message: "Login successful",
          token: token,
          user: userData,
        });
      } else {
        return res.status(401).json({
          message: "Incorrect password",
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
}

export function getAllUsers(req, res) {
  console.log(req.user);
  if (req.user && req.user.role === "admin") {
    User.find()
      .then((users) => {
        return res.status(200).json({
          message: "Users fetched successfully",
          users: users,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Error fetching users",
        });
      });
  } else {
    return res.status(403).json({
      message:
        "You are not authorized to perform this action, please login as admin",
    });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
}

export async function deleteUser(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message:
          "You are not authorized to perform this action, please login as admin",
      });
    }
    const deletedUser = await User.findOneAndDelete({ email: req.body.email });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
}

export async function changePassword(req, res) {
  const { email, otp, password } = req.body;

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "🔒 Your Password Has Been Changed",
    text: "Your password was successfully updated. If this wasn’t you, please contact support immediately.",
  };

  try {
    const lastOTPData = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!lastOTPData) {
      return res.status(404).json({ message: "No OTP found for this email" });
    }

    if (lastOTPData.otp !== otp) {
      return res.status(403).json({ message: "Invalid OTP" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await User.updateOne({ email }, { password: hashedPassword });

    await OTP.deleteMany({ email });

    transport.sendMail(message, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res
          .status(500)
          .json({ message: "Password changed, but failed to send email" });
      } else {
        console.log("Email sent:");
        return res.json({
          message: "Password changed successfully, email sent",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error changing password" });
  }
}

export async function sendOTP(req, res) {
  const email = req.body.email;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  const newOTP = new OTP({ email: email, otp: otp });

  newOTP
    .save()
    .then(() => {
      console.log("OTP saved successfully");
    })
    .catch(() => {
      console.log("Error saving OTP");
    });

  transport.sendMail(message, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error sending OTP",
      });
    } else {
      console.log("Email sent successfully");
      return res.status(200).json({
        message: "OTP sent successfully",
      });
    }
  });
}

export async function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(403).json({
      message: "Please login to access this resource",
    });
  }

  try {
    const freshUser = await User.findOne({ email: req.user.email }).select(
      "-password"
    );

    if (!freshUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: freshUser });
  } catch (err) {
    console.error("Error fetching current user:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
