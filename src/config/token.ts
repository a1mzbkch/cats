import jwt, { JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const generateToken = (userId: string, userEmail: string) => {
  if (!secret) {
    throw new Error("JWT_SECRET не задан в переменных окружения");
  }

  return jwt.sign({ id: userId, email: userEmail }, secret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  if (!secret) {
    throw new Error("JWT_SECRET не задан в переменных окружения");
  }
  const decoded = jwt.verify(token, secret);

  if (typeof decoded === "string" || !decoded) {
    throw new Error("Неверный токен");
  }
  return decoded as unknown as { id: string; email: string };
};
