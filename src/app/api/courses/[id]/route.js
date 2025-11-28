import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/mongodb.js";
import Course from "../../../../../models/Courses.js";

// ------------------------------------
// GET /api/courses/[id] - Fetch a single course by ID
// ------------------------------------
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { message: "Course not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return NextResponse.json(
      { message: "Failed to fetch course", error: error.message },
      { status: 500 }
    );
  }
}

// ------------------------------------
// PATCH /api/courses/[id] - Update a course
// ------------------------------------
export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const updateData = await request.json();

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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
  const { id } = await params;

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
