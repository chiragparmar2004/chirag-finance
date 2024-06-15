import User from "../models/user.model.js";
import EMI from "../models/emi.model.js";
import sendResponse from "../lib/responseHelper.js";
import Member from "../models/member.model.js";

// Fetch all received payments for a user
export const getAllReceivedPayments = async (req, res) => {
  try {
    const userId = req.userId; // Assuming user ID is available in the request object
    const user = await User.findById(userId).populate({
      path: "receivedPayments",
      populate: {
        path: "loan",
        populate: {
          path: "member",
        },
      },
    });

    res.status(200).json({
      success: true,
      data: user.receivedPayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching received payments",
      error: error.message,
    });
  }
};

// Fetch payments received on a specific date
export const getPaymentsByDate = async (req, res) => {
  try {
    const { date } = req.params; // Use params instead of query
    const userId = req.userId; // Assuming user ID is available in the request object

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const payments = await EMI.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      amount: { $ne: 0 }, // Exclude EMIs with an amount of 0
      loan: { $in: await getUserLoanIds(userId) },
    }).populate({
      path: "loan",
      populate: {
        path: "member",
      },
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching payments by date",
      error: error.message,
    });
  }
};

// Helper function to get loan IDs for a user
const getUserLoanIds = async (userId) => {
  const user = await User.findById(userId).populate("members");
  const loanIds = [];
  for (const member of user.members) {
    const memberLoans = await Member.findById(member._id).populate("loans");
    loanIds.push(...memberLoans.loans.map((loan) => loan._id));
  }
  return loanIds;
};
