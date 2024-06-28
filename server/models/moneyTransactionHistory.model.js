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
  paymentType: {
    type: String,
    enum: ["cash", "gpay"],
    required: true,
  },
});

const MoneyTransactionHistory = mongoose.model(
  "MoneyTransaction",
  moneyTransactionHistorySchema
);

export default MoneyTransactionHistory;
