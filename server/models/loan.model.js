import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  interest: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  collectedMoney: {
    type: Number,
  },
  lastPaymentDate: {
    type: Date,
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
});

export default mongoose.model("Loan", LoanSchema);
