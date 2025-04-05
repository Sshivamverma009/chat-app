import express from "express";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/messages.routes.js";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import {app, server} from './lib/socket.js'
dotenv.config();

// const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

connectDB()
  .then(() => {
    console.log("CONNECTING TO DATABASE");
    server.listen(process.env.PORT, () => {
      console.log("SERVER STARTED ON PORT : ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
