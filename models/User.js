import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: 6,
      select: false, // Do not return the password by default in queries
    },
    fullName: {
      type: String,
      required: [true, "Please provide a full name."],
      trim: true,
    },
    role: {
      type: String,
      enum: ["super-admin", "admin", "instructor"], // Define available roles
      default: "admin", // Most users will be standard admins
    },
    branch: {
      type: String,
      required: [true, "Please select a branch."],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Hash the password before saving a new user or updating the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password from the database (need to select it first)
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model, ensuring it only runs once
export default mongoose.models.User || mongoose.model("User", UserSchema);
