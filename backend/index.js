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
console.log("positionsRouter загружен");

app.use("/users", usersRouter);
console.log("usersRouter загружен");

app.use("/auth", authRouter);
console.log("authRouter загружен");

// Root
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Безопасное логирование маршрутов
setImmediate(() => {
  if (app._router && app._router.stack) {
    console.log("Содержимое app._router.stack:");
    app._router.stack.forEach((layer, idx) => {
      if (layer.route) {
        console.log(`${idx}: ROUTE path=${layer.route.path}, methods=${Object.keys(layer.route.methods)}`);
      } else if (layer.name === "router") {
        console.log(`${idx}: ROUTER path=`, layer.regexp);
      } else {
        console.log(`${idx}: MIDDLEWARE name=${layer.name}`);
      }
    });
  } else {
    console.log("Маршруты ещё недоступны (_router undefined)");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
