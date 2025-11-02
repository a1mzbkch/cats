import express from "express";
import globalRouter from "./routes";
import dotenv from "dotenv";
dotenv.config();

const buildServer = () => {
  const server = express();
  server.use(express.json());

  server.get("/", (req, res) =>
    res.status(200).json({
      message: "Добро пожаловать на сайт по продаже котов",
    })
  );

  server.use("/api/v1", globalRouter);

  return server;
};

export default buildServer;
