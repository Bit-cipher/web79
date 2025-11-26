"use client";
import { useState } from "react";
import { UserPlus, Loader2, X } from "lucide-react";

// --- Mock Data Options ---
const BRANCH_OPTIONS = [
  { value: "ibadan", label: "Ibadan" },
  { value: "lokoja", label: "Lokoja" },
  { value: "abuja", label: "Abuja" },
];

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "instructor", label: "Instructor" },
  { value: "super-admin", label: "Super Admin" },
];

// --- Reusable Form Components (Defined inside for self-containment) ---
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  </div>
);

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
// --- End Reusable Form Components ---

export default function CreateAdminModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    branch: "",
    role: ROLE_OPTIONS[0].value,
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Exit immediately if the modal is not open
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    // 1. 💡 Retrieve the JWT token from local storage
    const token = localStorage.getItem("authToken");

    // Safety check: if no token exists, warn the user and stop
    if (!token) {
      setStatusMessage({
        type: "error",
        text: "Authentication failed. Please log in again.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 2. 💡 Attach the Authorization header
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // Check 1: If the response is not 2xx, read the error message.
      if (!response.ok) {
        let errorMessage = "Failed to create user. Check server logs.";

        try {
          const errorData = await response.json();
          // The backend sends 'Forbidden: Only Super Admin can create accounts.' for 403 status
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Server Error (${response.status}).`;
        }

        setStatusMessage({ type: "error", text: errorMessage });
        setLoading(false);
        return;
      }

      // Check 2: Only proceed to parse as JSON if response.ok is true
      const data = await response.json();

      // Original success logic
      setStatusMessage({
        type: "success",
        text: `Successfully created user: ${data.user.fullName} with role ${data.user.role}.`,
      });
      // Reset form fields
      setFormData({
        fullName: "",
        email: "",
        password: "",
        branch: "",
        role: ROLE_OPTIONS[0].value,
      });
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Submission Error:", error);
      // This catch block handles network errors or unexpected parse errors
      setStatusMessage({
        type: "error",
        text: "An unexpected network error occurred or server did not respond.",
      });
    } finally {
      setLoading(false);
    }
  };

  const statusClasses =
    statusMessage.type === "success"
      ? "bg-green-100 text-green-700 border-green-500"
      : statusMessage.type === "error"
      ? "bg-red-100 text-red-700 border-red-500"
      : "hidden";

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/30 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            <span>CREATE NEW STAFF ACCOUNT</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage.text && (
          <div
            className={`p-4 mx-6 mt-4 border-l-4 rounded-lg ${statusClasses}`}
            role="alert"
          >
            <p className="font-bold">
              {statusMessage.type === "success" ? "Success" : "Error"}
            </p>
            <p>{statusMessage.text}</p>
          </div>
        )}

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g., Jane Doe"
              required
            />
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., staff@web79.com"
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Must be at least 6 characters"
              required
            />
            <FormSelect
              label="Assign Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={ROLE_OPTIONS}
              required
            />

            {/* Branch Assignment spans full width on mobile/small screen */}
            <div className="md:col-span-2">
              <FormSelect
                label="Assign Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                options={BRANCH_OPTIONS}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>CREATING...</span>
                </>
              ) : (
                <span>CREATE USER</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
