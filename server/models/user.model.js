import mongoose from "mongoose";

const interestHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    interestEarned: {
      type: Number,
      default: 0,
    },
    totalLoanGiven: {
      type: Number,
      default: 0,
    },
    money: {
      cash: { type: Number, default: 0 },
      bank: { type: Number, default: 0 },
      transactions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MoneyTransaction",
        },
      ],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    dailySettlements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyCollectionSettlement",
      },
    ],
    receivedPayments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EMI",
      },
    ],
    dueSettlements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DailyCollectionSettlement",
      },
    ],
    interestHistory: [interestHistorySchema], // New field for interest history
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
