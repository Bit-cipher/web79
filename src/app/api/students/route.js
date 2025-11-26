import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Student from "../../../../models/Students.js";

// ------------------------------------
// GET /api/students - Fetch all students
// ------------------------------------
export async function GET() {
  try {
    await dbConnect(); // Connect to MongoDB

    // Fetch all students, sorted by creation date (latest first)
    const students = await Student.find({}).sort({ createdAt: -1 });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Failed to fetch student list", error: error.message },
      { status: 500 }
    );
  }
}

// ------------------------------------
// POST /api/students - Register a new student
// ------------------------------------
export async function POST(request) {
  try {
    await dbConnect(); // Connect to MongoDB
    const studentData = await request.json();

    // 💡 Server-Side Calculation (Balance)
    const amountAgreed = Number(studentData.amountAgreed || 0);
    const firstPayment = Number(studentData.firstPayment || 0);

    const newStudentData = {
      ...studentData,
      amountAgreed: amountAgreed,
      firstPayment: firstPayment,
      balance: amountAgreed - firstPayment,
    };

    // Mongoose validation and saving
    const student = await Student.create(newStudentData);

    return NextResponse.json(
      { message: "Student registered successfully", student: student },
      { status: 201 }
    );
  } catch (error) {
    // Mongoose validation errors are handled here
    console.error("Error registering student:", error);
    return NextResponse.json(
      { message: "Failed to register student", error: error.message },
      { status: 400 } // Use 400 for validation/client-side errors
    );
  }
}
