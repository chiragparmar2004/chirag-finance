// controllers/loanController.js
import sendResponse from "../lib/responseHelper.js";
import Loan from "../models/loan.model.js";
import Member from "../models/member.model.js";
import EMI from "../models/emi.model.js";

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

    // Generate 100 EMIs
    const emiAmount = amount / 100;
    const emis = [];
    let emiDate = new Date(startDate);

    for (let i = 0; i < 100; i++) {
      emiDate.setMonth(emiDate.getMonth() + 1);
      const newEMI = new EMI({
        amount: emiAmount,
        date: new Date(emiDate),
        loan: newLoan._id,
      });
      emis.push(newEMI);
      await newEMI.save();
    }

    // Save the EMIs to the loan
    newLoan.emis = emis.map((emi) => emi._id);
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
