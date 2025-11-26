import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb.js";
import User from "../../../../models/User.js";

/**
 * Helper function to extract and verify the user role from the JWT token.
 */
const authorizeSuperAdmin = (request) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, message: "Not authorized, no token." };
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "super-admin") {
      return { authorized: true, role: decoded.role };
    } else {
      return {
        authorized: false,
        message: "Forbidden: Only Super Admin can create accounts.",
      };
    }
  } catch (error) {
    return {
      authorized: false,
      message: "Not authorized, token invalid or expired.",
    };
  }
};

// ------------------------------------
// POST /api/users - Create a new user (SUPER ADMIN ONLY)
// ------------------------------------
export async function POST(request) {
  await dbConnect();

  // 1. 💡 AUTHORIZATION CHECK
  const authResult = authorizeSuperAdmin(request);

  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: 403 }); // 403 Forbidden
  }

  try {
    const userData = await request.json();

    // 2. Simple Validation for required fields
    if (
      !userData.email ||
      !userData.password ||
      !userData.fullName ||
      !userData.branch
    ) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: email, password, full name, or branch.",
        },
        { status: 400 }
      );
    }

    // 3. Create the user (password hashing happens in the Mongoose pre-save hook)
    const user = await User.create(userData);

    // 4. Return the new user object
    return NextResponse.json(
      {
        message: "User created successfully.",
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    let message = "Error creating user account.";
    if (error.code === 11000) {
      message = "A user with this email already exists.";
    }

    return NextResponse.json(
      { message: message, error: error.message },
      { status: 400 }
    );
  }
}

// ------------------------------------
// Add a GET request handler for listing users (Optional, but useful)
// ------------------------------------
export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({}).select("-password"); // Fetch all, exclude password
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
