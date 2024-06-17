// controllers/loanController.js
import sendResponse from "../lib/responseHelper.js";
import Loan from "../models/loan.model.js";
import Member from "../models/member.model.js";
import EMI from "../models/emi.model.js";
import User from "../models/user.model.js";
import { format, addDays, parseISO } from "date-fns";

export const addLoan = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { amount, interest, startDate, paymentType } = req.body;

    // Validate input
    if (!amount || !interest || !startDate || !paymentType) {
      return sendResponse(res, 400, "Missing required fields");
    }

    // Calculate the end date as 100 days after the start date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 100);

    // Create a new loan
    const newLoan = new Loan({
      amount,
      interest,
      startDate,
      endDate,
      member: memberId,
    });

    // Save the new loan to the database
    await newLoan.save();

    // Find the member and add the loan to the member's loans list
    const member = await Member.findById(memberId);
    if (!member) {
      return sendResponse(res, 404, "Member not found");
    }

    if (!member.loans) {
      member.loans = [];
    }
    member.loans.push(newLoan._id);
    await member.save();

    // Find the user (assuming member is linked to a user)
    const user = await User.findById(member.user);
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    // Convert interestEarned to a number if it exists, otherwise initialize to 0
    user.interestEarned = Number(user.interestEarned || 0) + Number(interest);
    user.totalLoanGiven = Number(user.totalLoanGiven || 0) + Number(amount);
    // Deduct the amount from the user's money based on payment type
    const loanAmount = Number(amount) - Number(interest);
    if (paymentType === "cash") {
      if (user.money.cash < loanAmount) {
        return sendResponse(res, 400, "Insufficient cash balance");
      }
      user.money.cash -= loanAmount;
    } else if (paymentType === "gpay") {
      if (user.money.bank < loanAmount) {
        return sendResponse(res, 400, "Insufficient bank balance");
      }
      user.money.bank -= loanAmount;
    } else {
      return sendResponse(res, 400, "Invalid payment type");
    }

    // Save the updated user
    await user.save();

    // Send a success response
    sendResponse(res, 201, "Loan added successfully", newLoan);
  } catch (error) {
    console.error("Error in addLoan:", error.message);
    sendResponse(res, 500, "Error in addLoan");
  }
};

export const getLoans = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Retrieve all loans for the member
    const loans = await Loan.find({ member: memberId }).populate("emis");

    if (!loans.length) {
      return sendResponse(res, 404, "No loans found for this member");
    }

    // Send a success response with the loans
    sendResponse(res, 200, "Loans retrieved successfully", loans);
  } catch (error) {
    console.log("error in getLoans", error.message);
    sendResponse(res, 500, "error in getLoans");
  }
};

export const getLoanWithEMIs = async (req, res) => {
  try {
    const { loanId } = req.params;

    // Retrieve the loan with populated EMIs
    const loan = await Loan.findById(loanId).populate("emis");

    if (!loan) {
      return sendResponse(res, 404, "Loan not found");
    }

    // Send a success response with the loan and its EMIs
    sendResponse(res, 200, "Loan retrieved successfully with EMIs", loan);
  } catch (error) {
    console.log("error in getLoanWithEMIs", error.message);
    sendResponse(res, 500, "error in getLoanWithEMIs");
  }
};

// Controller function to fetch loans based on status
export const getLoansByStatus = async (req, res) => {
  try {
    const memberId = req.params.memberId; // Assuming userId is passed in the URL
    const status = req.params.status; // Assuming status is passed in the URL
    console.log(status);
    let loans;
    if (status === "All") {
      // Fetch all loans regardless of status for the given user
      loans = await Loan.find({ member: memberId }).populate("emis");
    } else {
      // Fetch loans based on status for the given user
      loans = await Loan.find({ member: memberId, status }).populate("emis");
    }

    res.status(200).json({ data: loans });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch loans" });
  }
};

export const renewLoan = async (req, res) => {
  try {
    const { newLoanAmount, interest, startDate, paymentType } = req.body;
    const loanId = req.params.loanId;

    // Find the old loan
    const oldLoan = await Loan.findById(loanId).populate("member");
    if (!oldLoan) {
      console.log("Old loan not found.");
      return sendResponse(res, 404, "Old loan not found");
    }

    console.log("OLD LOAN IS ", oldLoan);
    const memberId = oldLoan.member._id;
    // Calculate the remaining balance of the old loan
    const remainingBalance = oldLoan.amount - oldLoan.collectedMoney;

    // Calculate daily EMI amount
    const dailyEMIAmount = oldLoan.amount / 100; // Assuming 100 days for simplicity

    // Calculate how many days this amount covers
    const numberOfDays = Math.floor(remainingBalance / dailyEMIAmount);

    // Create new EMIs for the bulk payment
    const newEMIs = [];
    let currentDate = Date.now(); // Returns the current timestamp in milliseconds
    console.log(remainingBalance + " " + numberOfDays);
    // Add the first EMI entry with the full payment amount
    console.log("payment ", paymentType);
    const firstEMI = new EMI({
      amount: remainingBalance, // Provide the amount field
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
    oldLoan.collectedMoney = (oldLoan.collectedMoney || 0) + remainingBalance;
    oldLoan.lastPaymentDate = new Date();
    oldLoan.emis = oldLoan.emis.concat(newEMIs);
    console.log(numberOfDays, "day ");
    // Update receivedEMIsUntil and receivedEMIsUntilDate
    oldLoan.receivedEMIsUntilDate = new Date(
      currentDate + numberOfDays * 24 * 60 * 60 * 1000
    ); // Add numberOfDays to the current date
    console.log(oldLoan.receivedEMIsUntilDate);
    // Check if the oldLoan is fully paid
    if (oldLoan.collectedMoney >= oldLoan.amount) {
      oldLoan.status = "Paid"; // Updated status to "Paid"
    }

    // Save the updated oldLoan details
    await oldLoan.save();

    // Update the user's receivedPayments array
    const user = await User.findById(oldLoan.member.user);
    // user.receivedPayments.push(newEMIs[0]);
    console.log(user, "user");
    const totalDeductions = Number(remainingBalance) + Number(interest);

    console.log("Total deductions calculated:", totalDeductions);

    // Calculate the actual loan amount to be given to the user
    const actualLoanAmount = newLoanAmount - totalDeductions;
    console.log("Actual loan amount calculated:", actualLoanAmount);

    if (actualLoanAmount < 0) {
      console.log("New loan amount is not sufficient.");
      return sendResponse(
        res,
        400,
        "New loan amount is not sufficient to cover the remaining balance and interest"
      );
    }

    // Create the new loan
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 100);
    const newLoan = new Loan({
      amount: newLoanAmount,
      interest,
      startDate,
      endDate,
      member: memberId,
    });

    console.log("New loan created:", newLoan);

    // Save the new loan to the database
    await newLoan.save();

    console.log("New loan saved to the database.");

    // Mark the old loan as paid
    oldLoan.status = "Paid";
    await oldLoan.save();

    console.log("Old loan status updated to Paid.");

    // Find the member and update the loans list
    const member = await Member.findById(memberId);
    if (!member) {
      console.log("Member not found.");
      return sendResponse(res, 404, "Member not found");
    }

    console.log("Member found:", member);

    member.loans = member.loans.filter((loan) => loan.toString() !== loanId);
    member.loans.push(newLoan._id);
    await member.save();

    console.log("Member loans updated.");

    // Update user financial records
    user.interestEarned = Number(user.interestEarned || 0) + Number(interest);
    user.totalLoanGiven =
      Number(user.totalLoanGiven || 0) + Number(newLoanAmount);

    console.log("User financial records updated.");

    // Deduct the new loan amount from the user's balance
    if (paymentType === "cash") {
      if (user.money.cash < newLoanAmount) {
        console.log("Insufficient cash balance.");
        return sendResponse(res, 400, "Insufficient cash balance");
      }
      user.money.cash -= actualLoanAmount;
    } else if (paymentType === "GPay") {
      if (user.money.bank < newLoanAmount) {
        console.log("Insufficient bank balance.");
        return sendResponse(res, 400, "Insufficient bank balance");
      }
      user.money.bank -= actualLoanAmount;
    } else {
      console.log("Invalid payment type.");
      return sendResponse(res, 400, "Invalid payment type");
    }

    // Save the updated user
    await user.save();

    console.log("User saved with updated financial records.");

    // Send a success response
    console.log("Loan renewed successfully.");
    sendResponse(res, 201, "Loan renewed successfully", newLoan);
  } catch (error) {
    console.error("Error in renewLoan:", error.message);
    sendResponse(res, 500, "Error in renewLoan");
  }
};
