"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../../config/token");
const register = async (req, res) => {
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
        const findUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (findUser) {
            return res.status(409).json({
                success: false,
                message: "Пользователь с таким email уже существует",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
            data: {
                userName,
                email,
                password: hashedPassword,
            },
        });
        const token = (0, token_1.generateToken)(newUser.id, newUser.email);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: `Ошибка регистрации: ${error}`,
        });
    }
};
const login = async (req, res) => {
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
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Пользователь не найден",
            });
        }
        const comparePassword = await bcrypt_1.default.compare(password, user.password);
        if (!comparePassword) {
            return res.status(401).json({
                success: false,
                message: "Неверный пароль",
            });
        }
        const token = (0, token_1.generateToken)(user.id, user.email);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: `Ошибка входа: ${error}`,
        });
    }
};
exports.default = {
    register,
    login,
};
//# sourceMappingURL=auth.controllers.js.map