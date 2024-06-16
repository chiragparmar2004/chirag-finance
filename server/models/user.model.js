import mongoose from "mongoose";

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
    money: {
      cash: { type: Number, default: 0 },
      bank: { type: Number, default: 0 },
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
