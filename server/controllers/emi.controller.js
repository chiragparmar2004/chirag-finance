// controllers/emiController.js
import sendResponse from "../lib/responseHelper.js";
import EMI from "../models/emi.model.js";
import Loan from "../models/loan.model.js";

import { addDays } from "date-fns";
import User from "../models/user.model.js";
import DailyCollectionSettlement from "../models/dailyCollectionSettlement.model.js";

export const getEMIs = async (req, res) => {
  try {
    const { loanId } = req.params;

    // Retrieve all EMIs for the loan
    const emis = await EMI.find({ loan: loanId });

    if (!emis.length) {
      return sendResponse(res, 404, "No EMIs found for this loan");
    }

    // Send a success response with the EMIs
    sendResponse(res, 200, "EMIs retrieved successfully", emis);
  } catch (error) {
    console.log("error in getEMIs", error.message);
    sendResponse(res, 500, "error in getEMIs");
  }
};

export const addEMI = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, paymentType } = req.body;
    console.log(paymentType);
    // Find the loan
    const loan = await Loan.findById(loanId).populate("member");
    if (!loan) {
      return sendResponse(res, 404, "Loan not found");
    }

    // Calculate daily EMI amount
    const dailyEMIAmount = loan.amount / 100; // Assuming 100 days for simplicity

    // Calculate how many days this amount covers
    const numberOfDays = Math.floor(amount / dailyEMIAmount);

    // Create new EMIs for the bulk payment
    const newEMIs = [];
    let currentDate = Date.now(); // Returns the current timestamp in milliseconds

    // Add the first EMI entry with the full payment amount
    const firstEMI = new EMI({
      amount,
      paymentType,
      date: currentDate,
      loan: loanId,
    });
    await firstEMI.save();
    newEMIs.push(firstEMI._id);

    // Add subsequent EMI entries with zero amounts
    for (let i = 1; i < numberOfDays; i++) {
      const newEMI = new EMI({
        amount: 0,
        paymentType,
        date: currentDate,
        loan: loanId,
      });
      await newEMI.save();
      newEMIs.push(newEMI._id);
    }

    // Update loan details
    loan.collectedMoney = (loan.collectedMoney || 0) + amount;
    loan.lastPaymentDate = new Date();
    loan.emis = loan.emis.concat(newEMIs);
    console.log(numberOfDays, "day ");

    // Update receivedEMIsUntil and receivedEMIsUntilDate
    loan.receivedEMIsTillDate = addDays(
      loan.receivedEMIsTillDate,
      numberOfDays
    );
    // Check if the loan is fully paid
    if (loan.collectedMoney >= loan.amount) {
      loan.status = "Paid"; // Updated status to "Paid"
    }

    // Save the updated loan details
    await loan.save();
    console.log(loan.receivedEMIsTillDate, "loan receivedEMIsTillDate ");

    // Update the user's receivedPayments array
    const user = await User.findById(loan.member.user);
    user.receivedPayments.push(newEMIs[0]);

    // If payment type is gpay, add the money to user's gpay field
    if (paymentType === "GPay") {
      user.money.bank += amount;
    } else {
      // Update DailyCollectionSettlement if payment type is not gpay
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      let dailyCollection = await DailyCollectionSettlement.findOne({
        date: { $gte: startOfDay, $lt: endOfDay },
      });

      if (dailyCollection) {
        dailyCollection.totalAmountDue += amount;
        dailyCollection.dueAmount += amount;
      } else {
        dailyCollection = new DailyCollectionSettlement({
          date: currentDate,
          totalAmountDue: amount,
          amountReceived: 0,
          paymentType,
          cashAmount: 0,
          gpayAmount: 0,
          dueAmount: amount,
          isDueCleared: false,
        });
      }

      await dailyCollection.save();

      if (!user.dueSettlements.includes(dailyCollection._id)) {
        user.dueSettlements.push(dailyCollection._id);
      }

      // Add the daily settlement to the user's dailySettlements array
      if (!user.dailySettlements.includes(dailyCollection._id)) {
        user.dailySettlements.push(dailyCollection._id);
      }
    }
    await user.save();

    // Send a success response
    sendResponse(res, 201, "Bulk payment added successfully", loan);
  } catch (error) {
    console.log("error in addEMI", error.message);
    sendResponse(res, 500, "Error in addEMI");
  }
};
