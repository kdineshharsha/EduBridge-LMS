import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function verifyJWT(req, res, next) {
  const header = req.headers["Authorization"];
  if (header) {
    const token = header.replace("Bearer ", "");
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        req.user = decoded;
      }
    });
  }
  next();
}

export default verifyJWT;
