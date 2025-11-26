import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import dbConnect from "../../../../../lib/mongodb.js";
import User from "../../../../../models/User.js";
import "dotenv/config";

/**
 * Helper function to generate a JWT token
 * This token will be sent to the frontend for future authorized requests
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

// ------------------------------------
// POST /api/auth/login - Authenticate user
// ------------------------------------
export async function POST(request) {
  await dbConnect();

  try {
    const { email, password, branch } = await request.json();

    // 1. Find user by email (we need to explicitly select the password field)
    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (user && (await user.matchPassword(password))) {
      // 2. Credentials are correct. Check branch.
      if (user.branch !== branch) {
        return NextResponse.json(
          { message: "Login failed: Incorrect branch selected." },
          { status: 401 }
        );
      }

      const token = generateToken(user._id, user.role);

      return NextResponse.json(
        {
          message: "Login successful",
          token: token,
          user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            branch: user.branch,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Login failed: Invalid email or password." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Server error during login process." },
      { status: 500 }
    );
  }
}
