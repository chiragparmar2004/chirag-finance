// controllers/emiController.js
import sendResponse from "../lib/responseHelper.js";
import EMI from "../models/emi.model.js";
import Loan from "../models/loan.model.js";

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
    const { amount, paymentType, date } = req.body;

    // Find the loan
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return sendResponse(res, 404, "Loan not found");
    }

    // Calculate daily EMI amount
    const dailyEMIAmount = loan.amount / 100; // Assuming 100 days for simplicity

    // Calculate how many days this amount covers
    const numberOfDays = Math.floor(amount / dailyEMIAmount);

    // Create a new EMI for the bulk payment
    const newEMI = new EMI({
      amount: amount,
      paymentType: paymentType,
      date: date,
      loan: loanId,
    });

    // Save the new EMI to the database
    await newEMI.save();

    // Update loan details
    loan.collectedMoney = (loan.collectedMoney || 0) + amount;
    loan.lastPaymentDate = new Date(date);

    // Calculate the next payment date
    let nextPaymentDate = new Date(loan.lastPaymentDate);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + numberOfDays + 1);

    loan.nextPaymentDate = nextPaymentDate;
    loan.emis.push(newEMI._id);

    // Save the updated loan details
    await loan.save();

    // Send a success response
    sendResponse(res, 201, "Bulk payment added successfully", newEMI);
  } catch (error) {
    console.log("error in addEMI", error.message);
    sendResponse(res, 500, "error in addEMI");
  }
};
