import DailyCollectionSettlement from "../models/dailyCollectionSettlement.model.js";
import TransactionHistory from "../models/transactionHistory.model.js";
import User from "../models/user.model.js";

export const updateSettlement = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { cashAmount, gpayAmount } = req.body;

    console.log("Settlement ID:", id);
    console.log("Cash Amount:", cashAmount);
    console.log("GPay Amount:", gpayAmount);

    const settlement = await DailyCollectionSettlement.findById(id);
    console.log("Settlement:", settlement);

    if (!settlement) {
      console.log("Settlement not found");
      return res
        .status(404)
        .json({ success: false, message: "Settlement not found" });
    }

    // Update amounts
    const totalReceived = settlement.amountReceived + cashAmount + gpayAmount;
    console.log("Total Received:", totalReceived);

    settlement.amountReceived = totalReceived;
    settlement.cashAmount += cashAmount;
    settlement.gpayAmount += gpayAmount;
    settlement.dueAmount = settlement.totalAmountDue - totalReceived;

    console.log("Updated Settlement:", settlement);

    if (settlement.dueAmount <= 0) {
      settlement.isDueCleared = true;
    }

    // Save transaction history
    const transaction = new TransactionHistory({
      date: new Date(),
      amount: cashAmount + gpayAmount,
      paymentType: { cash: cashAmount, gpay: gpayAmount },
      settlement: id,
    });
    console.log("Transaction:", transaction);
    await transaction.save();

    // Update the settlement
    await settlement.save();

    // If due is not cleared, add to user's dueSettlements
    if (!settlement.isDueCleared) {
      const user = await User.findById(settlement.user);
      console.log("User:", user);
      if (!user.dueSettlements.includes(settlement._id)) {
        user.dueSettlements.push(settlement._id);
        await user.save();
      }
    }

    const user = await User.findById(userId);

    user.money.cash += cashAmount;
    user.money.bank += gpayAmount;

    await user.save();

    res.status(200).json({ success: true, data: settlement });
  } catch (error) {
    console.error("Error updating settlement:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch all settlements
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

// Fetch a settlement by date
export const getSettlementByDate = async (req, res) => {
  try {
    const { date } = req.params;
    console.log(`Requested date: ${date}`);

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const settlement = await DailyCollectionSettlement.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!settlement) {
      return res
        .status(404)
        .json({ success: false, message: "Settlement not found" });
    }

    res.status(200).json({ success: true, data: settlement });
  } catch (error) {
    console.error("Error fetching settlement by date:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching settlement by date",
      error: error.message,
    });
  }
};

export const getUserDueSettlements = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is in req.token
    console.log(userId);
    const user = await User.findById(userId).populate("dueSettlements");

    if (!user) {
      console.log("user not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user.dueSettlements });
  } catch (error) {
    console.error("Error fetching user due settlements:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getTransactionHistoryBySettlementId = async (req, res) => {
  try {
    const { settlementId } = req.params;
    const transactionHistory = await TransactionHistory.find({
      settlement: settlementId,
    });
    res.status(200).json({ success: true, data: transactionHistory });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
