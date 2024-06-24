import mongoose from "mongoose";

const moneyTransactionHistorySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const moneyTransactionHistory = mongoose.model(
  "MoneyTransaction",
  moneyTransactionHistorySchema
);

export default moneyTransactionHistory;
