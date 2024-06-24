import sendResponse from "../lib/responseHelper.js";
import DailyCollectionSettlement from "../models/dailyCollectionSettlement.model.js";
import moneyTransactionHistory from "../models/moneyTransactionHistory.model.js";
import TransactionHistory from "../models/transactionHistory.model.js";
import User from "../models/user.model.js";

export const updateSettlement = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { cashAmount, gpayAmount } = req.body;

    const settlement = await DailyCollectionSettlement.findById(id);

    if (!settlement) {
      console.log("Settlement not found");
      return res
        .status(404)
        .json({ success: false, message: "Settlement not found" });
    }

    // Update amounts
    const totalReceived = settlement.amountReceived + cashAmount + gpayAmount;
    settlement.amountReceived = totalReceived;
    settlement.cashAmount += cashAmount;
    settlement.gpayAmount += gpayAmount;
    settlement.dueAmount = settlement.totalAmountDue - totalReceived;

    if (settlement.dueAmount <= 0) {
      settlement.isDueCleared = true;

      // Remove settlement from user's dueSettlements array
      const user = await User.findById(userId);
      if (user) {
        const index = user.dueSettlements.indexOf(settlement._id);
        if (index !== -1) {
          user.dueSettlements.splice(index, 1);
          await user.save();
        }
      }
    }

    // Create and save transaction histories

    const cashTransaction = new moneyTransactionHistory({
      amount: cashAmount,
      type: "credit",
      purpose: "Cash payment for settlement",
    });
    if (cashAmount > 0) {
      await cashTransaction.save();
    }
    const gpayTransaction = new moneyTransactionHistory({
      amount: gpayAmount,
      type: "credit",
      purpose: "GPay payment for settlement",
    });
    if (gpayAmount > 0) {
      await gpayTransaction.save();
    }
    // Update user's money accounts and add transactions to user's history
    const user = await User.findById(userId);
    if (user) {
      user.money.cash += cashAmount;
      user.money.bank += gpayAmount;
      user.money.transactions.push(cashTransaction._id);
      user.money.transactions.push(gpayTransaction._id);
      await user.save();
    }

    // Update the settlement
    await settlement.save();

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
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const settlement = await DailyCollectionSettlement.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!settlement) {
      sendResponse(res, 404, "settlement not found");
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
