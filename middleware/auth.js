import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication failed. No token provided." });
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodeData?.id;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};

export default auth;
