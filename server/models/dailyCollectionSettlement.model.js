import mongoose from "mongoose";

const { Schema } = mongoose;
const DailyCollectionSettlementSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  totalAmountDue: {
    type: Number,
    // required: true,
  },
  amountReceived: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentType: {
    type: String,
    enum: ["cash", "GPay", "Both"],
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
  isDueCleared: {
    type: Boolean,
    default: false,
  },
});

const DailyCollectionSettlement = mongoose.model(
  "DailyCollectionSettlement",
  DailyCollectionSettlementSchema
);

export default DailyCollectionSettlement;
