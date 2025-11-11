import { Request, Response } from "express";
import prisma from "../../config/prisma";

const getAllCats = async (req: Request, res: Response) => {
  try {
    const cats = await prisma.cats.findMany();
    res.status(200).json({
      success: true,
      data: cats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка при получении данных: ${error}`,
    });
  }
};

const getCatById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Не передан catId",
      });
    }

    const cat = await prisma.cats.findUnique({
      where: { id },
    });

    if (!cat) {
      return res.status(404).json({
        success: false,
        message: "Кот не найден",
      });
    }

    res.status(200).json({
      success: true,
      data: cat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка при получении кота по уникальному id: ${error}`,
    });
  }
};

const addCat = async (req: Request, res: Response) => {
  try {
    const { image, name, color, age, paws, price, sale } = req.body;

    if (!image || !name || !color || !age || !paws || !price) {
      return res.status(400).json({
        success: false,
        message: "Все обязательные поля должны быть заполнены",
      });
    }

    const newCat = await prisma.cats.create({
      data: {
        image,
        name,
        color,
        age,
        paws,
        price,
        sale,
      },
    });

    res.status(201).json({
      success: true,
      message: "Кот успешно добавлен",
      data: newCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Ошибка при добавлении данных: ${error}`,
    });
  }
};

const deleteCat = async (req: Request, res: Response) => {
  try {
    const { catId } = req.body;

    if (!catId) {
      return res.status(400).json({
        success: false,
        message: "Не передан catId",
      });
    }

    const deleted = await prisma.cats.delete({
      where: { id: catId },
    });

    res.status(200).json({
      success: true,
      message: "Кот успешно удалён",
      data: deleted,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Ошибка при удалении кота: ${error.message}`,
    });
  }
};

const updateCat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { image, name, color, age, paws, price, sale } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Не передан catId",
      });
    }

    const updatedCat = await prisma.cats.update({
      where: { id },
      data: {
        image,
        name,
        color,
        age,
        paws,
        price,
        sale,
      },
    });

    res.status(200).json({
      success: true,
      message: "Кот успешно обновлен",
      data: updatedCat,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Ошибка при обновлении кота: ${error.message}`,
    });
  }
};

const replaceCat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { image, name, color, age, paws, price, sale } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Не передан catId",
      });
    }

    if (!image || !name || !color || !age || !paws || !price) {
      return res.status(400).json({
        success: false,
        message: "Все обязательные поля должны быть заполнены",
      });
    }

    const updatedCat = await prisma.cats.update({
      where: { id },
      data: {
        image,
        name,
        color,
        age,
        paws,
        price,
        sale,
      },
    });

    res.status(200).json({
      success: true,
      message: "Кот успешно заменен",
      data: updatedCat,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: `Ошибка при обновлении кота: ${error.message}`,
    });
  }
};

export default {
  getAllCats,
  getCatById,
  deleteCat,
  addCat,
  updateCat,
  replaceCat,
};
