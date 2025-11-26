"use client";
import { useState, useEffect, useCallback } from "react"; // 💡 Import useEffect and useCallback
import { ChevronDown, Loader2 } from "lucide-react";
import WelcomeBanner from "../../../../components/welcome.jsx";
// --- Mock Data Options (Gender, Payment Type remain local) ---
const GENDER_OPTIONS = [
  { value: "", label: "Select Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const PAYMENT_OPTIONS = [
  { value: "", label: "Select Payment Type" },
  { value: "full", label: "Full Payment" },
  { value: "installment", label: "Installment" },
];
// --- End Mock Data Options ---

// Custom Select Component (Reusable)
const FormSelect = (
  { label, name, value, onChange, options, isLoading = false } // 💡 Added isLoading prop
) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative mt-1">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={isLoading} // Disable while loading
        className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
      >
        {isLoading && <option value="">Loading {label}...</option>}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.value === ""}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
    </div>
  </div>
);

// Custom Input Component (Reusable)
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
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
        required
        className="block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  </div>
);

const initialFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  address: "",
  nokPhoneNumber: "",
  gender: "",
  course: "",
  paymentType: "",
  amountAgreed: 0,
  firstPayment: 0,
};

export default function RegisterStudentPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // 💡 NEW STATES for course data
  const [availableCourses, setAvailableCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // 💡 FUNCTION to fetch courses from API
  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    try {
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        // Map data to { value: courseName, label: courseName } format
        const options = data.map((course) => ({
          value: course.name,
          label: `${course.name} (${course.duration})`,
        }));
        // Prepend the default "Select Course" option
        setAvailableCourses([
          { value: "", label: "Select Course" },
          ...options,
        ]);
      } else {
        console.error("Failed to fetch course options:", response.status);
        setAvailableCourses([{ value: "", label: "Failed to load courses" }]);
      }
    } catch (error) {
      console.error("Network error fetching courses:", error);
      setAvailableCourses([{ value: "", label: "Network Error" }]);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  // 💡 FETCH courses on initial load
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure numerical fields are parsed correctly
    const finalValue =
      name === "amountAgreed" || name === "firstPayment"
        ? Number(value)
        : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: `Student ${formData.fullName} registered successfully!`,
        });
        resetForm(); // Clear form on success
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Registration failed due to a server error.",
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatusMessage({
        type: "error",
        text: "Network error. Could not connect to the backend API.",
      });
    } finally {
      setLoading(false);
      // Clear success/error message after 4 seconds
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    }
  };

  // --- Status Message Display Logic ---
  const statusClasses =
    statusMessage.type === "success"
      ? "bg-green-100 text-green-700 border-green-500"
      : statusMessage.type === "error"
      ? "bg-red-100 text-red-700 border-red-500"
      : "hidden";

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <WelcomeBanner />

      <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-15">
        REGISTER STUDENT
      </h1>

      {/* Status Message Display */}
      {statusMessage.text && (
        <div
          className={`p-4 mb-4 border-l-4 rounded-lg ${statusClasses}`}
          role="alert"
        >
          <p className="font-bold">
            {statusMessage.type === "success" ? "Success" : "Error"}
          </p>
          <p>{statusMessage.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Personal Info */}
          <div className="space-y-6">
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g., Jane Doe"
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., jane@example.com"
            />
            <FormInput
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g., 080XXXXXXXX"
            />

            {/* 💡 DYNAMIC COURSE SELECTION */}
            <FormSelect
              label="Course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              options={availableCourses}
              isLoading={coursesLoading} // Pass loading state
            />
          </div>

          {/* Column 2: Details & Payment */}
          <div className="space-y-6">
            <FormInput
              label="NOK Phone Number"
              name="nokPhoneNumber"
              type="tel"
              value={formData.nokPhoneNumber}
              onChange={handleChange}
              placeholder="Next of Kin Phone Number"
            />
            <FormSelect
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={GENDER_OPTIONS}
            />
            <FormSelect
              label="Payment Type"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              options={PAYMENT_OPTIONS}
            />
            <FormInput
              label="Amount Agreed (NGN)"
              name="amountAgreed"
              type="number"
              value={formData.amountAgreed || ""}
              onChange={handleChange}
              placeholder="e.g., 50000"
            />
            {/* NOTE: Changed name from amountPaid back to firstPayment to match Mongoose Model */}
            <FormInput
              label="Amount Paid (NGN)"
              name="firstPayment"
              type="number"
              value={formData.firstPayment || ""}
              onChange={handleChange}
              placeholder="e.g., 20000"
            />
            <FormInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street Address, City"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-green-400 flex items-center space-x-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{loading ? "REGISTERING..." : "REGISTER"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
