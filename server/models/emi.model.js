import mongoose from "mongoose";

const EMISchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ["Cash", "UPI"],
  },
  date: {
    type: Date,
    required: true,
  },
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
});

export default mongoose.model("EMI", EMISchema);
