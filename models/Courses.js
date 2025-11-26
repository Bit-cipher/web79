import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a course name."],
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, "Please provide an instructor name."],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Please provide a course duration."],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Upcoming"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
