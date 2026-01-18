import express from "express";
import { connectDB } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import AdminRouter from "./routes/admin.routes.js";
import StaffRouter from "./routes/staff.routes.js";
import AccountRouter from "./routes/account.routes.js";
import { initWhatsapp } from "./utils/whatsapp.js";
import UserRouter from "./routes/user.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import TransactionRouter from "./routes/transaction.routes.js";
import LoanRoute from "./routes/loan.routes.js";
import CardRouter from "./routes/card.route.js";
import KycRouter from "./routes/kyc.route.js";
import TransactionAnayticsRouter from "./routes/transactionAnaytics.routes.js";

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
await initWhatsapp();



//routes 


app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/staff", StaffRouter);
app.use("/api/v1/account", AccountRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/transactions", TransactionRouter);
app.use("/api/v1/loan", LoanRoute);
app.use("/api/v1/card", CardRouter);
app.use("/api/v1/kyc", KycRouter);
app.use("/api/v1/transaction-anaytics", TransactionAnayticsRouter);

app.listen(PORT, async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error("❌ Server running but DB connection failed");
  } else {
    console.log("🚀 Server running at http://localhost:1510");
  }
});