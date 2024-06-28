import User from "../models/user.model.js";

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId, "userId: ");
    const user = await User.findById(userId).populate("money.transactions");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user.money.transactions });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
