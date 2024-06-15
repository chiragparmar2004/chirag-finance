import mongoose from "mongoose";

const { Schema } = mongoose;

const DailyCollectionSettlementSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  totalAmountDue: {
    type: Number,
    required: true,
  },
  amountReceived: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentType: {
    type: String,
    enum: ["Cash", "GPay", "Both"],
    required: true,
  },
  cashAmount: {
    type: Number,
    default: 0,
  },
  gpayAmount: {
    type: Number,
    default: 0,
  },
  dueAmount: {
    type: Number,
    default: 0,
  },
});

const DailyCollectionSettlement = mongoose.model(
  "DailyCollectionSettlement",
  DailyCollectionSettlementSchema
);

export default DailyCollectionSettlement;
