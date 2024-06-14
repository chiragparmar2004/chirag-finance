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

// export const addEMI = async (req, res) => {
//   try {
//     const { loanId } = req.params;
//     const { amount, paymentType, date } = req.body;

//     // Find the loan
//     const loan = await Loan.findById(loanId);
//     if (!loan) {
//       return sendResponse(res, 404, "Loan not found");
//     }

//     // Calculate daily EMI amount
//     const dailyEMIAmount = loan.amount / 100; // Assuming 100 days for simplicity

//     // Calculate how many days this amount covers
//     const numberOfDays = Math.floor(amount / dailyEMIAmount);
//     console.log(numberOfDays, "number of days");
//     // Create a new EMI for the bulk payment
//     const newEMI = new EMI({
//       amount: amount,
//       paymentType: paymentType,
//       date: date,
//       loan: loanId,
//     });

//     // Save the new EMI to the database
//     await newEMI.save();

//     // Update loan details
//     loan.collectedMoney = (loan.collectedMoney || 0) + amount;
//     loan.lastPaymentDate = new Date(date);

//     // Calculate the next payment date
//     let nextPaymentDate = new Date(loan.lastPaymentDate);
//     nextPaymentDate.setDate(nextPaymentDate.getDate() + numberOfDays + 1);
//     console.log(nextPaymentDate.toString(), "payment date");
//     loan.nextPaymentDate = nextPaymentDate;
//     loan.emis.push(newEMI._id);

//     // Save the updated loan details
//     await loan.save();

//     // Send a success response
//     sendResponse(res, 201, "Bulk payment added successfully", newEMI);
//   } catch (error) {
//     console.log("error in addEMI", error.message);
//     sendResponse(res, 500, "error in addEMI");
//   }
// };

import { addDays } from "date-fns";

// export const addEMI = async (req, res) => {
//   try {
//     const { loanId } = req.params;
//     const { amount, paymentType, date } = req.body;

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
//     let currentDate = new Date(date);

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
//       currentDate = addDays(currentDate, 1);
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
//     loan.lastPaymentDate = new Date(date);
//     loan.emis = loan.emis.concat(newEMIs);

//     // Save the updated loan details
//     await loan.save();

//     // Send a success response
//     sendResponse(res, 201, "Bulk payment added successfully", newEMIs);
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
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return sendResponse(res, 404, "Loan not found");
    }

    // Calculate daily EMI amount
    const dailyEMIAmount = loan.amount / 100; // Assuming 100 days for simplicity

    // Calculate how many days this amount covers
    const numberOfDays = Math.floor(amount / dailyEMIAmount);

    // Create new EMIs for the bulk payment
    const newEMIs = [];
    let remainingAmount = amount;
    let currentDate = new Date();

    for (let i = 0; i < numberOfDays; i++) {
      const emiAmount = dailyEMIAmount;
      const newEMI = new EMI({
        amount: emiAmount,
        paymentType: paymentType,
        date: currentDate,
        loan: loanId,
      });
      await newEMI.save();
      newEMIs.push(newEMI._id);
      remainingAmount -= emiAmount;
      // currentDate = addDays(currentDate, 1);
    }

    // Add the remaining amount as the last EMI if any
    if (remainingAmount > 0) {
      const newEMI = new EMI({
        amount: remainingAmount,
        paymentType: paymentType,
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

    // Save the updated loan details
    await loan.save();

    // Send a success response
    sendResponse(res, 201, "Bulk payment added successfully", loan);
  } catch (error) {
    console.log("error in addEMI", error.message);
    sendResponse(res, 500, "error in addEMI");
  }
};

// export const addEMI = async (req, res) => {
//   try {
//     const { loanId } = req.params;
//     const { amount, paymentType } = req.body;

//     // Find the loan
//     const loan = await Loan.findById(loanId);
//     if (!loan) {
//       return sendResponse(res, 404, "Loan not found");
//     }

//     // Create new EMI entry
//     const newEMI = new EMI({
//       amount,
//       paymentType,
//       date: new Date(), // or use the provided paymentDate if you pass it from frontend
//       loan: loanId,
//     });

//     // Save the new EMI
//     await newEMI.save();

//     // Update loan details
//     loan.emis.push(newEMI._id);
//     await loan.save();

//     // Send a success response
//     sendResponse(res, 201, "EMI added successfully", loan);
//   } catch (error) {
//     console.error("Error adding EMI:", error.message);
//     sendResponse(res, 500, "Error adding EMI");
//   }
// };
