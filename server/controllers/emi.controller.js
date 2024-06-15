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

import { addDays } from "date-fns";
import User from "../models/user.model.js";

//TODO
// export const addEMI = async (req, res) => {
//   try {
//     const { loanId } = req.params;
//     const { amount, paymentType } = req.body;

//     // Find the loan
//     const loan = await Loan.findById(loanId);
//     if (!loan) {
//       return sendResponse(res, 404, "Loan not found");
//     }

//     // Calculate daily EMI amount
//     const dailyEMIAmount = loan.amount / 100; // Assuming 100 days for simplicity

//     // Calculate how many days this amount covers
//     const numberOfDays = Math.floor(amount / dailyEMIAmount);

//     // Create new EMIs for the bulk payment
//     const newEMIs = [];
//     let remainingAmount = amount;
//     let currentDate = new Date();

//     for (let i = 0; i < numberOfDays; i++) {
//       const emiAmount = dailyEMIAmount;
//       const newEMI = new EMI({
//         amount: emiAmount,
//         paymentType: paymentType,
//         date: currentDate,
//         loan: loanId,
//       });
//       await newEMI.save();
//       newEMIs.push(newEMI._id);
//       remainingAmount -= emiAmount;
//       // currentDate = addDays(currentDate, 1);
//     }

//     // Add the remaining amount as the last EMI if any
//     if (remainingAmount > 0) {
//       const newEMI = new EMI({
//         amount: remainingAmount,
//         paymentType: paymentType,
//         date: currentDate,
//         loan: loanId,
//       });
//       await newEMI.save();
//       newEMIs.push(newEMI._id);
//     }

//     // Update loan details
//     loan.collectedMoney = (loan.collectedMoney || 0) + amount;
//     loan.lastPaymentDate = new Date();
//     loan.emis = loan.emis.concat(newEMIs);

//     // Save the updated loan details
//     await loan.save();

//     // Send a success response
//     sendResponse(res, 201, "Bulk payment added successfully", loan);
//   } catch (error) {
//     console.log("error in addEMI", error.message);
//     sendResponse(res, 500, "error in addEMI");
//   }
// };

//Todo:Complete runnig below
// export const addEMI = async (req, res) => {
//   try {
//     const { loanId } = req.params;
//     const { amount, paymentType } = req.body;

//     // Find the loan
//     const loan = await Loan.findById(loanId);
//     if (!loan) {
//       return sendResponse(res, 404, "Loan not found");
//     }

//     // Calculate daily EMI amount
//     const dailyEMIAmount = loan.amount / 100; // Assuming 100 days for simplicity

//     // Calculate how many days this amount covers
//     const numberOfDays = Math.floor(amount / dailyEMIAmount);

//     // Create new EMIs for the bulk payment
//     const newEMIs = [];
//     let currentDate = new Date();

//     // Add the first EMI entry with the full payment amount
//     const firstEMI = new EMI({
//       amount: amount,
//       paymentType: paymentType,
//       date: currentDate,
//       loan: loanId,
//     });
//     await firstEMI.save();
//     newEMIs.push(firstEMI._id);

//     // Add subsequent EMI entries with zero amounts
//     for (let i = 1; i < numberOfDays; i++) {
//       currentDate = new Date(currentDate.setDate(currentDate.getDate()));
//       const newEMI = new EMI({
//         amount: 0,
//         paymentType: paymentType,
//         date: currentDate,
//         loan: loanId,
//       });
//       await newEMI.save();
//       newEMIs.push(newEMI._id);
//     }

//     // Update loan details
//     loan.collectedMoney = (loan.collectedMoney || 0) + amount;
//     loan.lastPaymentDate = new Date();
//     loan.emis = loan.emis.concat(newEMIs);

//     // Check if the loan is fully paid
//     if (loan.collectedMoney >= loan.amount) {
//       loan.status = "complete"; // Assuming 'complete' is the status for fully paid loans
//     }

//     // Save the updated loan details
//     await loan.save();

//     // Send a success response
//     sendResponse(res, 201, "Bulk payment added successfully", loan);
//   } catch (error) {
//     console.log("error in addEMI", error.message);
//     sendResponse(res, 500, "error in addEMI");
//   }
// };

export const addEMI = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, paymentType } = req.body;

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
    let currentDate = new Date();

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
      currentDate = new Date(currentDate.setDate(currentDate.getDate()));
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

    // Check if the loan is fully paid
    if (loan.collectedMoney >= loan.amount) {
      loan.status = "Paid"; // Updated status to "Paid"
    }

    // Save the updated loan details
    await loan.save();

    // Update the user's receivedPayments array
    const user = await User.findById(loan.member.user);
    user.receivedPayments.push(newEMIs[0]);
    await user.save();

    // Send a success response
    sendResponse(res, 201, "Bulk payment added successfully", loan);
  } catch (error) {
    console.log("error in addEMI", error.message);
    sendResponse(res, 500, "Error in addEMI");
  }
};
