import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRouter from "./routes/product.js";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auths.js";
import uploadRputer from "./routes/uploads.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL_CORS,
    credentials: true,
  })
);
app.use(cookieParser());

app.listen(7700, () => {
  console.log("Server is running on http://localhost:7700/api");
});

app.use("/api/upload", uploadRputer);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/users", userRouter);
