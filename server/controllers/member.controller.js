import sendResponse from "../lib/responseHelper.js";
import Member from "../models/member.model.js";
import User from "../models/user.model.js";

export const addMember = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is in req.token
    console.log(userId);
    const { name, mobileNumber } = req.body;

    // Check if the member already exists for this user
    const existingMember = await Member.findOne({ name, user: userId });
    if (existingMember) {
      return sendResponse(res, 400, "Member already exists");
    }

    // Create a new member
    const newMember = new Member({
      name,
      mobileNumber,
      user: userId,
    });

    // Save the new member to the database
    await newMember.save();

    // Find the user and add the member to the user's members list
    const user = await User.findById(userId);
    user.members.push(newMember._id);
    await user.save();

    // Send a success response
    sendResponse(res, 201, "Member added successfully", newMember);
  } catch (error) {
    console.log("error in addMember", error.message);
    sendResponse(res, 500, "error in addMember");
  }
};

export const getAllMembers = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set by the verifyToken middleware

    // Retrieve all members for the user
    const members = await Member.find({ user: userId });

    if (!members.length) {
      return sendResponse(res, 404, "No members found");
    }

    // Send a success response with the members
    sendResponse(res, 200, "Members retrieved successfully", members);
  } catch (error) {
    console.log("error in getAllMembers", error.message);
    sendResponse(res, 500, "error in getAllMembers");
  }
};
