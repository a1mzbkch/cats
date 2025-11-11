import { Request, Response } from "express";
import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../config/token";
import nodemailer from "nodemailer";

const register = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Все поля обязательны для заполнения",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Неверный формат email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Пароль должен быть минимум 6 символов",
      });
    }

    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (findUser) {
      return res.status(409).json({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(newUser.id, newUser.email);

    res.status(201).json({
      success: true,
      message: "Пользователь успешно зарегистрирован",
      token,
      user: {
        id: newUser.id,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка регистрации: ${error}`,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password, ...rest } = req.body;

    if (Object.keys(rest).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Лишние поля в запросе. Допустимы только email и password",
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Все поля обязательны для заполнения",
      });
    }

    const user: any = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Неверный пароль",
      });
    }

    const token = generateToken(user.id, user.email);

    res.status(200).json({
      success: true,
      message: "Вход выполнен успешно",
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка входа: ${error}`,
    });
  }
};

const sendResetCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        success: false,
        message: "Заполните email",
      });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.resetPassword.create({
      data: { email, code, expiresAt },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Код сброса пароля",
      text: `Ваш код для сброса пароля: ${code}`,
    });

    res.status(200).json({
      success: true,
      message: "Код отправлен на почту",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error}`,
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Введите email, код и новый пароль",
      });
    }

    const record = await prisma.resetPassword.findFirst({
      where: { email, code },
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Неверный код или email",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Код истёк, запросите новый",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Пароль должен быть минимум 6 символов",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.resetPassword.deleteMany({
      where: { email },
    });

    res.status(200).json({
      success: true,
      message: "Пароль успешно обновлён",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      message: `Ошибка: ${message}`,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Токен не найден",
      });
    }

    await prisma.blacklistedToken.create({ data: { token } });

    res.status(200).json({
      success: true,
      message: "Вы успешно вышли из аккаунта.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка выхода: ${error}`,
    });
  }
};

export default {
  register,
  login,
  sendResetCode,
  resetPassword,
  logout,
};
