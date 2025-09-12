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

// Логирование маршрутов — надёжно
function logRoutes() {
  if (app._router && Array.isArray(app._router.stack)) {
    console.log("Подключённые роуты:");
    app._router.stack
      .filter(r => r.route) // оставляем только настоящие маршруты
      .forEach(r => {
        const methods = Object.keys(r.route.methods).join(", ").toUpperCase();
        console.log(`${methods} -> ${r.route.path}`);
      });
  } else {
    console.log("Маршруты ещё недоступны");
  }
}

// Вызов после короткой задержки, чтобы _router точно создался
setTimeout(logRoutes, 50);

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
