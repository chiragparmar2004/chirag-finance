import express from "express";
import dbConnection from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import loanRoute from "./routes/loan.route.js";
import emiRoute from "./routes/emi.route.js";
import paymentRoute from "./routes/payments.route.js";
import settlementRoute from "./routes/settlements.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());

dbConnection();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("<h1>Hello There this is backend of chirag project</h1>");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/loan", loanRoute);
app.use("/api/emi", emiRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/settlement", settlementRoute);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", transactionRoutes); // Add this line to include the transaction routes

app.get("/api/v1/checking-server", (req, res) => {
  try {
    res.status(200).json({
      message: "Successfully Connected to Backend Server",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Connect to Backend Server",
    });
  }
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
