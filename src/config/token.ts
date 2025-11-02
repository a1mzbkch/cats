import jwt from "jsonwebtoken";

export const generateToken = (userId: string, UserEmail: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET не задан в переменных окружения");
  }

  return jwt.sign({ id: userId, email: UserEmail }, secret, {
    expiresIn: "7d",
  });
};
