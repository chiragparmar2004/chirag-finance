// models/TransactionHistory.js

import mongoose from "mongoose";

const transactionHistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      cash: { type: Number, default: 0 },
      gpay: { type: Number, default: 0 },
    },
    settlement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyCollectionSettlement",
      required: true,
    },
  },
  { timestamps: true }
);

const TransactionHistory = mongoose.model(
  "TransactionHistory",
  transactionHistorySchema
);
export default TransactionHistory;
