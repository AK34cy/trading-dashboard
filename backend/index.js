// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import positionsRouter from "./routes/positions.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/positions", positionsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// Root
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);

  // Даем Express 10 секунд на регистрацию маршрутов, затем логируем
  setTimeout(() => {
    if (app._router) {
      console.log("Подключённые роуты:");
      app._router.stack
        .filter(r => r.route)
        .forEach(r => {
          console.log(Object.keys(r.route.methods), r.route.path);
        });
    } else {
      console.log("Маршруты недоступны");
    }
  }, 10000); // 10 секунд
});
