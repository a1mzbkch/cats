import { Request, Response } from "express";
import prisma from "../../config/prisma";

const addFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, catId } = req.body;

    const findCat = await prisma.favorite.findFirst({
      where: { userId, catId },
    });

    if (findCat) {
      return res.status(400).json({
        success: false,
        message: "Этот кот уже в избранном",
      });
    }

    const favorite = await prisma.favorite.create({
      data: { userId, catId },
    });

    res.status(201).json({
      success: true,
      message: "Кот добавлен в избранное",
      data: favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка при добавлении в избранное: ${error}`,
    });
  }
};

const getFavorites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Не передан userId",
      });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { cat: true },
    });

    res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка при получении избранного: ${error}`,
    });
  }
};

const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, catId } = req.body;

    await prisma.favorite.deleteMany({
      where: { userId, catId },
    });

    res.status(200).json({
      success: true,
      message: "Кот успешно удалён из избранного",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка при удалении из избранного: ${error}`,
    });
  }
};

export default { addFavorite, getFavorites, deleteFavorite };
