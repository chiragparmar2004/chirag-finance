import User from "../models/user.model.js";

// Fetch dashboard summary

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user data
    const user = await User.findById(userId)
      .populate("members")
      .populate("dailySettlements")
      .populate("receivedPayments")
      .populate("interestHistory");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate total interest earned
    let totalInterestEarned = user.interestEarned || 0;

    // Calculate total loan given
    let totalLoanGiven = user.totalLoanGiven || 0;

    // Calculate total repayment
    let totalRepayment = 0;
    user.receivedPayments.forEach((payment) => {
      totalRepayment += payment.amount;
    });

    // Calculate total due amount from dailySettlements
    let totalDueAmount = 0;
    user.dailySettlements.forEach((settlement) => {
      totalDueAmount += settlement._doc.dueAmount;
    });

    // Prepare the summary object
    const summary = {
      totalInterestEarned,
      totalLoanGiven,
      totalRepayment,
      totalDueAmount,
      cash: user.money.cash,
      bank: user.money.bank,
      interestHistory: user.interestHistory, // Include the interest history
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch dashboard summary" });
  }
};

// Fetch recent loans
export const getRecentLoans = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate({
      path: "members",
      populate: {
        path: "loans",
        options: { sort: { startDate: -1 }, limit: 5 },
      },
    });

    const recentLoans = [];
    user.members.forEach((member) => {
      member.loans.forEach((loan) => {
        recentLoans.push({
          ...loan.toObject(),
          member: {
            name: member.name,
            profilePicture: member.profilePicture,
          },
        });
      });
    });

    recentLoans.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    res.status(200).json(recentLoans.slice(0, 5));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch recent loans" });
  }
};

// Fetch recent settlements
export const getRecentSettlements = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate({
      path: "dailySettlements",
      options: { sort: { date: -1 }, limit: 5 },
    });

    res.status(200).json(user.dailySettlements);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch recent settlements" });
  }
};
