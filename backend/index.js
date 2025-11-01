import express from "express";
import { connectDB } from "./utils/db.js";

const PORT = 1510;
const app = express();

app.listen(1510, async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error("❌ Server running but DB connection failed");
  } else {
    console.log("🚀 Server running at http://localhost:1510");
  }
});