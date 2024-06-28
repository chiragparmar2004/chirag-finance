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
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
  collectedMoney: {
    type: Number,
    default: 0,
  },
  lastPaymentDate: {
    type: Date,
  },
  nextPaymentDate: {
    type: Date,
  },
  receivedEMIsTillDate: { type: Date }, // Date until which EMIs have been received

  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member", // Make sure it matches the name of the Member model
    required: true,
  },

  emis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EMI",
    },
  ],
});

export default mongoose.model("Loan", LoanSchema);
