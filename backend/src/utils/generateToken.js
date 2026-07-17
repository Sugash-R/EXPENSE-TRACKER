import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, "secretkey", {
    expiresIn: "30d",
  });
};

export default generateToken;