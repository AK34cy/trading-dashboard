import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import positionsRouter from "./routes/positions.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/positions", positionsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// root
app.get("/", (req, res) => res.send("Backend работает!"));

// запуск сервера
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
