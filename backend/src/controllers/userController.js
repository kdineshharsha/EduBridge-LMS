import User from "../models/user.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

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
