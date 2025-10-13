import ServerlessHttp from "serverless-http";
import express from "express";
import { Request, Response, NextFunction } from "express";
import userRouter from "./routes/userRoutes";
import { checkDatabaseConnection } from "./config/db.connection";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

config();
const app = express();
app.use(cookieParser());

app.use(express.json());
app.use("/users", userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

checkDatabaseConnection();
export const handler = ServerlessHttp(app);
