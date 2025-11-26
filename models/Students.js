import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide a full name."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    // Next of Kin Phone Number
    nokPhoneNumber: {
      type: String,
    },
    gender: {
      type: String,
    },
    course: {
      type: String,
      required: [true, "Please select a course."],
    },
    paymentType: {
      type: String,
      enum: ["full", "installment"],
    },
    amountAgreed: {
      type: Number,
      default: 0,
    },
    firstPayment: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    // 💡 NEW FIELD ADDED: Track if the balance is zero
    fullyPaid: {
      type: Boolean,
      default: false, // Default to false
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the model, ensuring it only runs once
export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
