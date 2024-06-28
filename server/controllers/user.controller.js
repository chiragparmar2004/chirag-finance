import MoneyTransactionHistory from "../models/moneyTransactionHistory.model.js";
import User from "../models/user.model.js";

// Add a new money transaction and update user's money
export const addMoneyTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, type, purpose, paymentType } = req.body;

    // Validate request parameters
    if (!userId || !amount || !type || !purpose || !paymentType) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create a new transaction
    const newTransaction = new MoneyTransactionHistory({
      amount,
      type,
      purpose,
      paymentType,
    });
    await newTransaction.save();
    const amountToBeAdded = Number(amount);
    // Update user's money based on transaction type and payment type
    if (type === "credit") {
      if (paymentType === "cash") {
        user.money.cash += amountToBeAdded;
      } else if (paymentType === "gpay") {
        user.money.bank += amountToBeAdded;
      }
    } else if (type === "debit") {
      if (paymentType === "cash") {
        user.money.cash -= amountToBeAdded;
      } else if (paymentType === "gpay") {
        user.money.bank -= amountToBeAdded;
      }
    }

    // Add transaction to user's transaction history
    user.money.transactions.push(newTransaction._id);
    await user.save();

    // Respond with success
    res.status(200).json({ success: true, data: newTransaction });
  } catch (error) {
    console.error("Error adding money transaction:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getFilteredTransactions = async (req, res) => {
  console.log("here in getFilteredTransactions");
  try {
    const { startDate, endDate, type, paymentType, minAmount, maxAmount } =
      req.query;

    // Build the query object
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (type) query.type = type;
    if (paymentType) query.paymentType = paymentType;
    if (minAmount) query.amount = { ...query.amount, $gte: Number(minAmount) };
    if (maxAmount) query.amount = { ...query.amount, $lte: Number(maxAmount) };

    // Fetch the filtered transactions from the database
    const transactions = await MoneyTransactionHistory.find(query);
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching filtered transactions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
