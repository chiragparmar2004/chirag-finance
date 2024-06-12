// controllers/loanController.js
import sendResponse from "../lib/responseHelper.js";
import Loan from "../models/loan.model.js";
import Member from "../models/member.model.js";

export const addLoan = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { amount, interest, startDate, endDate } = req.body;

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
    console.log(newLoan, "new:Loan");
    // Find the member and add the loan to the member's loans list
    const member = await Member.findById(memberId);
    console.log(member);
    member.loans.push(newLoan._id);
    await member.save();

    // Send a success response
    sendResponse(res, 201, "Loan added successfully", newLoan);
  } catch (error) {
    console.log("error in addLoan", error.message);
    sendResponse(res, 500, "error in addLoan");
  }
};

export const getLoans = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Retrieve all loans for the member
    const loans = await Loan.find({ member: memberId });

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
