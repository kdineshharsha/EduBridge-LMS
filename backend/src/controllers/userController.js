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

  const message = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "Welcome to Our Service!",
    html: `
  <div style="
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background: #f5f7fa;
    padding: 40px 0;
    color: #333;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    ">

      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #4f46e5, #9333ea);
        padding: 30px 20px;
        text-align: center;
        color: white;
      ">
        <h1 style="margin: 0; font-size: 32px; font-weight: 700;">
          Welcome to Edu-Bridge 🎓
        </h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">
          Your learning journey starts now.
        </p>
      </div>

      <!-- Illustration / Banner -->
      <div style="width:100%; background:#fafafa;">
        <img 
          src="https://i.postimg.cc/4xqv6VX3/welcome-illustration.png" 
          alt="Welcome" 
          style="width:100%; object-fit: cover;"
        />
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        <h2 style="
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #111;
        ">
          Hi there 👋
        </h2>

        <p style="
          font-size: 16px;
          line-height: 1.6;
          margin: 18px 0 24px;
          color: #555;
        ">
          Welcome to <strong>Edu-Bridge</strong> — we're really happy to have
          you with us.  
          You're now part of a growing community of learners aiming to improve, grow,
          and achieve great things.
        </p>

        <!-- Feature Cards -->
        <div style="margin: 30px 0;">
          <div style="
            background: #f5f5ff;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 12px;
            border-left: 5px solid #4f46e5;
          ">
            <strong>📚 Access Courses</strong><br/>
            Explore a wide range of modern and high-quality online courses.
          </div>

          <div style="
            background: #fff2fd;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 12px;
            border-left: 5px solid #9333ea;
          ">
            <strong>⚡ Track Your Progress</strong><br/>
            Keep an eye on your learning performance with useful insights.
          </div>

          <div style="
            background: #eefdf7;
            padding: 16px;
            border-radius: 12px;
            border-left: 5px solid #10b981;
          ">
            <strong>🎯 Learn at Your Pace</strong><br/>
            Study anytime, from anywhere — your learning is in your control.
          </div>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 36px 0;">
          <a href="http://localhost:5173" 
            style="
              display: inline-block;
              background: linear-gradient(135deg, #4f46e5, #9333ea);
              padding: 14px 32px;
              border-radius: 12px;
              color: white;
              text-decoration: none;
              font-size: 17px;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(79,70,229,0.3);
            ">
            Go to Dashboard →
          </a>
        </div>

        <p style="font-size: 14px; text-align:center; color: #777; margin-top: 20px;">
          Need help? Our support team is here for you anytime.
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background: #f3f4f6; 
        text-align: center; 
        padding: 16px;
        font-size: 13px; 
        color: #777;
      ">
        © 2025 Edu-Bridge. All rights reserved.
      </div>

    </div>
  </div>
`,
  };

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

  transport.sendMail(message, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        message: "Error sending email",
      });
    } else {
      console.log("Email sent successfully");
      return res.status(200).json({
        message: "Email sent successfully",
      });
    }
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
        _id: user._id,
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

      const message = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Welcome to Our Service!",
        html: `
  <div style="
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background: #f5f7fa;
    padding: 40px 0;
    color: #333;
  ">
    <div style="
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    ">

      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #4f46e5, #9333ea);
        padding: 30px 20px;
        text-align: center;
        color: white;
      ">
        <h1 style="margin: 0; font-size: 32px; font-weight: 700;">
          Welcome to Edu-Bridge 🎓
        </h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">
          Your learning journey starts now.
        </p>
      </div>

      <!-- Illustration / Banner -->
      <div style="width:100%; background:#fafafa;">
        <img 
          src="https://i.postimg.cc/4xqv6VX3/welcome-illustration.png" 
          alt="Welcome" 
          style="width:100%; object-fit: cover;"
        />
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        <h2 style="
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #111;
        ">
          Hi there 👋
        </h2>

        <p style="
          font-size: 16px;
          line-height: 1.6;
          margin: 18px 0 24px;
          color: #555;
        ">
          Welcome to <strong>Edu-Bridge</strong> — we're really happy to have
          you with us.  
          You're now part of a growing community of learners aiming to improve, grow,
          and achieve great things.
        </p>

        <!-- Feature Cards -->
        <div style="margin: 30px 0;">
          <div style="
            background: #f5f5ff;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 12px;
            border-left: 5px solid #4f46e5;
          ">
            <strong>📚 Access Courses</strong><br/>
            Explore a wide range of modern and high-quality online courses.
          </div>

          <div style="
            background: #fff2fd;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 12px;
            border-left: 5px solid #9333ea;
          ">
            <strong>⚡ Track Your Progress</strong><br/>
            Keep an eye on your learning performance with useful insights.
          </div>

          <div style="
            background: #eefdf7;
            padding: 16px;
            border-radius: 12px;
            border-left: 5px solid #10b981;
          ">
            <strong>🎯 Learn at Your Pace</strong><br/>
            Study anytime, from anywhere — your learning is in your control.
          </div>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 36px 0;">
          <a href="http://localhost:5173" 
            style="
              display: inline-block;
              background: linear-gradient(135deg, #4f46e5, #9333ea);
              padding: 14px 32px;
              border-radius: 12px;
              color: white;
              text-decoration: none;
              font-size: 17px;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(79,70,229,0.3);
            ">
            Go to Dashboard →
          </a>
        </div>

        <p style="font-size: 14px; text-align:center; color: #777; margin-top: 20px;">
          Need help? Our support team is here for you anytime.
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background: #f3f4f6; 
        text-align: center; 
        padding: 16px;
        font-size: 13px; 
        color: #777;
      ">
        © 2025 Edu-Bridge. All rights reserved.
      </div>

    </div>
  </div>
`,
      };
      transport.sendMail(message, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "Error sending email",
          });
        } else {
          return res.status(200).json({
            message: "Email sent successfully",
          });
        }
      });

      const userData = {
        _id: user._id,
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
    html: `
    <div style="
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: #f5f7fa;
      padding: 40px 0;
      color: #333;
    ">
      <div style="
        max-width: 520px;
        margin: auto;
        background: white;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0,0,0,0.10);
      ">

        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #ef4444, #dc2626);
          padding: 24px;
          text-align: center;
          color: white;
        ">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700;">
            Password Updated
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 18px;
            color: #444;
          ">
            Hi there 👋  
            This is a confirmation that your password has been successfully changed.
          </p>

          <div style="
            background: #fff5f5;
            padding: 16px;
            border-left: 4px solid #ef4444;
            border-radius: 10px;
            margin-bottom: 24px;
          ">
            <p style="
              margin: 0;
              font-size: 15px;
              color: #b91c1c;
              line-height: 1.6;
            ">
              If you didn't change your password, please secure your account
              immediately.
            </p>
          </div>

          <div style="text-align:center; margin: 24px 0;">
            <a href="http://localhost:5173/forgot-password"
              style="
                display: inline-block;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                padding: 12px 26px;
                color: white;
                text-decoration: none;
                font-weight: 600;
                border-radius: 10px;
                font-size: 15px;
                box-shadow: 0 4px 12px rgba(239,68,68,0.25);
              ">
              Secure My Account →
            </a>
          </div>

          <p style="font-size: 13px; color:#777; line-height:1.6; margin-top:22px;">
            If this action was done by you, no further steps are required.
          </p>
        </div>

        <!-- Footer -->
        <div style="
          background: #f3f4f6; 
          text-align: center; 
          padding: 14px;
          font-size: 12px; 
          color: #777;
        ">
          © 2025 Edu-Bridge Security System.
        </div>

      </div>
    </div>
  `,
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
    subject: "🔐 OTP Verification Code",
    html: `
    <div style="
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: #f5f7fa;
      padding: 40px 0;
      color: #333;
    ">
      <div style="
        max-width: 500px;
        margin: auto;
        background: white;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0,0,0,0.10);
      ">

        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          padding: 24px;
          text-align: center;
          color: white;
        ">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700;">
            Verify Your Email
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            Hi there 👋<br/>
            Use the verification code below to complete your login/registration.
          </p>

          <!-- OTP Box -->
          <div style="
            background: #f3f4ff;
            padding: 20px;
            border-left: 4px solid #4f46e5;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 28px;
          ">
            <p style="
              font-size: 32px;
              font-weight: 700;
              letter-spacing: 4px;
              margin: 0;
              color: #4f46e5;
            ">
              ${otp}
            </p>
          </div>

          <p style="font-size: 14px; color: #666; margin-bottom: 24px;">
            This OTP is valid for <strong>5 minutes</strong>.  
            Please do not share this code with anyone.
          </p>

          <p style="font-size: 14px; color: #888; text-align:center;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="
          background: #f3f4f6; 
          text-align: center; 
          padding: 14px;
          font-size: 12px; 
          color: #777;
        ">
          © 2025 Edu-Bridge. Secure Authentication System.
        </div>

      </div>
    </div>
  `,
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
