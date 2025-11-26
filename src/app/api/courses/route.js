import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb.js";
import Course from "../../../../models/Courses.js";

// ------------------------------------
// GET /api/courses - Fetch all courses
// ------------------------------------
export async function GET() {
  try {
    await dbConnect();

    const courses = await Course.find({}).sort({ name: 1 });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Failed to fetch course list", error: error.message },
      { status: 500 }
    );
  }
}

// ------------------------------------
// POST /api/courses - Add a new course
// ------------------------------------
export async function POST(request) {
  try {
    await dbConnect(); // Connect to MongoDB
    const courseData = await request.json();

    // Mongoose validation and saving
    const course = await Course.create(courseData);

    return NextResponse.json(
      { message: "Course added successfully", course: course },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { message: "Failed to add course", error: error.message },
      { status: 400 } // Use 400 for validation/client-side errors
    );
  }
}

// ------------------------------------
// PATCH /api/courses/[id] - Update a course
// ------------------------------------
export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const updateData = await request.json();

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run schema validation
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { message: "Course not found for update." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course updated successfully", course: updatedCourse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course:", error);
    // Returns 400 for validation errors (e.g., missing required field)
    return NextResponse.json(
      { message: "Failed to update course", error: error.message },
      { status: 400 }
    );
  }
}

// ------------------------------------
// DELETE /api/courses/[id] - Delete a course
// ------------------------------------
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return NextResponse.json(
        { message: "Course not found for deletion." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { message: "Failed to delete course", error: error.message },
      { status: 500 }
    );
  }
}
