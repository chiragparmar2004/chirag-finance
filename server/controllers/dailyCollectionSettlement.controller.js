import DailyCollectionSettlement from "../models/dailyCollectionSettlement.model.js";

export const createSettlement = async (req, res) => {
  try {
    const { date, totalAmountDue, cashAmount, gpayAmount } = req.body;

    const amountReceived = parseInt(cashAmount) + parseInt(gpayAmount);
    console.log(amountReceived);
    const dueAmount = totalAmountDue - amountReceived;
    let paymentType = "Both";
    if (cashAmount > 0 && gpayAmount === 0) paymentType = "Cash";
    if (gpayAmount > 0 && cashAmount === 0) paymentType = "GPay";

    const newSettlement = new DailyCollectionSettlement({
      date,
      totalAmountDue,
      amountReceived,
      paymentType,
      cashAmount,
      gpayAmount,
      dueAmount,
    });

    await newSettlement.save();
    res.status(201).json({ success: true, data: newSettlement });
  } catch (error) {
    console.error("Error creating settlement:", error);
    res.status(500).json({
      success: false,
      message: "Error creating settlement",
      error: error.message,
    });
  }
};

export const updateSettlement = async (req, res) => {
  try {
    const { id } = req.params;
    const { cashAmount, gpayAmount } = req.body;

    const settlement = await DailyCollectionSettlement.findById(id);
    if (!settlement) {
      return res
        .status(404)
        .json({ success: false, message: "Settlement not found" });
    }

    settlement.cashAmount += cashAmount;
    settlement.gpayAmount += gpayAmount;
    settlement.amountReceived += cashAmount + gpayAmount;
    settlement.dueAmount =
      settlement.totalAmountDue - settlement.amountReceived;

    if (settlement.cashAmount > 0 && settlement.gpayAmount === 0) {
      settlement.paymentType = "Cash";
    } else if (settlement.gpayAmount > 0 && settlement.cashAmount === 0) {
      settlement.paymentType = "GPay";
    } else {
      settlement.paymentType = "Both";
    }

    await settlement.save();
    res.status(200).json({ success: true, data: settlement });
  } catch (error) {
    console.error("Error updating settlement:", error);
    res.status(500).json({
      success: false,
      message: "Error updating settlement",
      error: error.message,
    });
  }
};

export const getSettlements = async (req, res) => {
  try {
    const settlements = await DailyCollectionSettlement.find().sort({
      date: -1,
    });
    res.json({ success: true, data: settlements });
  } catch (error) {
    console.error("Error fetching settlements:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
