import mongoose from "mongoose";
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
    const profileImage = `https://ui-avatars.com/api/?name=${name}`;

    // Create a new member
    const newMember = new Member({
      name,
      mobileNumber,
      user: userId,
      profilePicture: profileImage,
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

export const getSingleMember = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set by the verifyToken middleware
    const { memberId } = req.params; // Destructure memberId from req.params

    // Validate the memberId
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return sendResponse(res, 400, "Invalid memberId");
    }

    // Retrieve the member by ID
    const member = await Member.findById(memberId);

    if (!member) {
      return sendResponse(res, 404, "Member not found");
    }

    // Send a success response with the member
    sendResponse(res, 200, "Member retrieved successfully", member);
  } catch (error) {
    console.log("error in get member", error.message);
    sendResponse(res, 500, "Error in getSingleMember");
  }
};

export const dashboardDetails = async (req, res) => {
  try {
    console.log("first dashboard");
    res.status(200).json({ message: "hello" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMembersWithPendingEMIs = async (req, res) => {
  console.log("her e");
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    console.log(sevenDaysAgo.toString());
    // Find all members who have loans with receivedEMIsUntilDate older than 7 days ago
    const members = await Member.find({
      "loans.receivedEMIsUntilDate": { $lt: sevenDaysAgo },
    }).populate({
      path: "loans",
      match: { receivedEMIsUntilDate: { $lt: sevenDaysAgo } },
    });
    console.log(members);
    sendResponse(
      res,
      200,
      "Members with pending EMIs retrieved successfully",
      members
    );
  } catch (error) {
    console.log("error in getMembersWithPendingEMIs", error.message);
    sendResponse(res, 500, "Error in getMembersWithPendingEMIs");
  }
};
