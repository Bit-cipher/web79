import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb";
import Student from "../../../../../models/Students";
import jwt from "jsonwebtoken";

/**
 * Helper function to extract and verify the user role from the JWT token.
 * This is a simplified check.
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
        message: "Forbidden: Requires Super Admin privileges.",
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
// GET /api/students/[id] - Fetch a single student by ID (Optional)
// ------------------------------------
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json(
        { message: "Student not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch student", error: error.message },
      { status: 500 }
    );
  }
}

// ------------------------------------
// PATCH /api/students/[id] - Update a student
// ------------------------------------
export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = params;

  // NOTE: Authorization for PATCH is typically less strict than DELETE/POST

  try {
    const updateData = await request.json();

    // Recalculate Balance and Fully Paid on Update
    const amountAgreed = Number(updateData.amountAgreed || 0);
    const firstPayment = Number(updateData.firstPayment || 0);
    const balance = amountAgreed - firstPayment;

    const finalUpdate = {
      ...updateData,
      balance: balance,
      fullyPaid: balance <= 0,
    };

    const updatedStudent = await Student.findByIdAndUpdate(id, finalUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found for update." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student updated successfully", student: updatedStudent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update student", error: error.message },
      { status: 400 }
    );
  }
}

// ------------------------------------
// DELETE /api/students/[id] - Delete a student
// ------------------------------------
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;

  // 1. 💡 AUTHORIZATION CHECK
  const authResult = authorizeSuperAdmin(request);

  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: 403 }); // 403 Forbidden
  }

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        { message: "Student not found for deletion." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { message: "Failed to delete student", error: error.message },
      { status: 500 }
    );
  }
}
