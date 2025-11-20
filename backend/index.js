import express from "express";
import { connectDB } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import Authrouter from "./routes/auth.routes.js";
import AdminRouter from "./routes/admin.routes.js";
import StaffRouter from "./routes/staff.routes.js";
import AccountRouter from "./routes/account.routes.js";

dotenv.config();
const PORT = 1510;
const app = express();


const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    callback(null, true);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



//routes 


app.use("/api/v1/auth", Authrouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/staff", StaffRouter);
app.use("/api/v1/account", AccountRouter);


app.listen(PORT, async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error("❌ Server running but DB connection failed");
  } else {
    console.log("🚀 Server running at http://localhost:1510");
  }
});