import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes";
import adminRouter from "./routes/adminRoutes";
import authRouter from "./routes/authRoutes";

const app = express();

const corsConfig = {
  // origin: "http://localhost:5173",
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

export default app;
