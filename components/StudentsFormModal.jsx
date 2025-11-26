"use client";
import { useState, useEffect } from "react";
import { User, Loader2, X, AlertTriangle, ChevronDown } from "lucide-react";

// --- Mock Data Options (for Course, Gender, Payment) ---
const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const COURSE_OPTIONS = [
  { value: "web_dev", label: "Web Development" },
  { value: "app_dev", label: "App Development" },
  { value: "data_analysis", label: "Data Analysis" },
  { value: "digital_marketing", label: "Digital Marketing" },
];

const PAYMENT_OPTIONS = [
  { value: "full", label: "Full Payment" },
  { value: "installment", label: "Installment" },
];
// --- End Mock Data Options ---

// --- Reusable Form Components ---
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
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
        readOnly={readOnly}
        className={`block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          readOnly ? "bg-gray-100" : ""
        }`}
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
    <div className="relative mt-1">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {/* Add a default/placeholder option */}
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
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
// --- End Reusable Form Components ---

const initialFormState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  address: "",
  nokPhoneNumber: "",
  gender: "",
  course: "",
  paymentType: "installment",
  amountAgreed: 0,
  firstPayment: 0,
};

export default function StudentFormModal({
  isOpen,
  onClose,
  onStudentUpdated,
  initialData,
  isReadOnly,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const isEditing = !!initialData?._id && !isReadOnly; // Truly editing if ID exists AND it's not read-only
  const isViewing = !!initialData?._id && isReadOnly; // Only viewing if ID exists AND it is read-only

  // 1. Effect to load initial data when prop changes (for editing/viewing)
  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        address: initialData.address || "",
        nokPhoneNumber: initialData.nokPhoneNumber || "",
        gender: initialData.gender || "",
        course: initialData.course || "",
        paymentType: initialData.paymentType || PAYMENT_OPTIONS[0].value,
        amountAgreed: initialData.amountAgreed || 0,
        firstPayment: initialData.firstPayment || 0,
      });
    } else {
      setFormData(initialFormState);
    }
    setStatusMessage({ type: "", text: "" });
  }, [initialData]);

  if (!isOpen) return null;

  // Calculate balance on the frontend for immediate display
  const calculatedBalance =
    (formData.amountAgreed || 0) - (formData.firstPayment || 0);
  const formattedBalance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(calculatedBalance);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle number inputs
    const finalValue =
      name === "amountAgreed" || name === "firstPayment"
        ? Number(value)
        : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    // Exit early if the user is just viewing the form
    if (isViewing) {
      setLoading(false);
      onClose();
      return;
    }

    // Determine API path and method
    const apiPath = isEditing
      ? `/api/students/${initialData._id}`
      : "/api/students";
    const method = isEditing ? "PATCH" : "POST";

    // NOTE: Sending JWT token is only necessary for secure endpoints (like delete/admin create)
    // PATCH/POST usually relies on session/basic auth if needed, but we keep it simple here.

    try {
      const response = await fetch(apiPath, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: isEditing
            ? `Student ${formData.fullName} updated successfully!`
            : `Student ${formData.fullName} registered successfully!`,
        });
        if (!isEditing) {
          setFormData(initialFormState);
        }
        onStudentUpdated(); // Notify parent to refresh the list
        setTimeout(onClose, 2000);
      } else {
        setStatusMessage({
          type: "error",
          text:
            data.message ||
            `Failed to ${isEditing ? "update" : "register"} student.`,
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatusMessage({
        type: "error",
        text: "An unexpected network error occurred.",
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

  let modalTitle = "REGISTER NEW STUDENT";
  if (isViewing) {
    modalTitle = `VIEW STUDENT DETAILS: ${initialData.fullName}`;
  } else if (isEditing) {
    modalTitle = `EDIT STUDENT: ${initialData.fullName}`;
  }

  const buttonText = isViewing
    ? "CLOSE DETAILS"
    : isEditing
    ? "SAVE CHANGES"
    : "REGISTER STUDENT";
  const isSubmitDisabled = loading || isViewing;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/30 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <User className="w-5 h-5 text-green-600" />
            <span>{modalTitle}</span>
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

        {/* ID and Balance Display */}
        {isEditing || isViewing ? (
          <div className="p-2 mx-6 mt-4 bg-gray-50 text-gray-500 rounded-lg flex items-center space-x-2 text-sm">
            <span className="font-semibold">
              ID: {initialData._id.slice(-6)}
            </span>
            <span className="font-semibold ml-auto">
              Balance:
              <span
                className={
                  calculatedBalance > 0
                    ? "text-red-500 ml-1"
                    : "text-green-600 ml-1"
                }
              >
                {formattedBalance}
              </span>
            </span>
          </div>
        ) : null}

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Group 1: Personal Info */}
            <div className="space-y-6">
              <FormInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g., Jane Doe"
                readOnly={isViewing}
              />
              {/* Email is READ-ONLY in edit/view mode */}
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., jane@example.com"
                required={!isEditing && !isViewing}
                readOnly={isEditing || isViewing}
              />
              <FormInput
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g., 080XXXXXXXX"
                readOnly={isViewing}
              />
            </div>

            {/* Group 2: Course & Kin */}
            <div className="space-y-6">
              <FormSelect
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Course" },
                  ...COURSE_OPTIONS,
                ]}
                required={!isViewing}
              />
              <FormInput
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address, City"
                readOnly={isViewing}
              />
              <FormInput
                label="NOK Phone Number"
                name="nokPhoneNumber"
                type="tel"
                value={formData.nokPhoneNumber}
                onChange={handleChange}
                placeholder="Next of Kin Phone Number"
                readOnly={isViewing}
              />
            </div>

            {/* Group 3: Payment & Balance */}
            <div className="space-y-6">
              <FormInput
                label="Amount Agreed (NGN)"
                name="amountAgreed"
                type="number"
                value={formData.amountAgreed}
                onChange={handleChange}
                placeholder="e.g., 50000"
                readOnly={isViewing}
              />
              {/* 💡 RENAME: firstPayment is now "Amount Paid" */}
              <FormInput
                label="Amount Paid (NGN)"
                name="firstPayment"
                type="number"
                value={formData.firstPayment}
                onChange={handleChange}
                placeholder="e.g., 20000"
                readOnly={isViewing}
              />
              <FormSelect
                label="Payment Type"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Type" },
                  ...PAYMENT_OPTIONS,
                ]}
                required={!isViewing}
              />
              <FormSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select Gender" },
                  ...GENDER_OPTIONS,
                ]}
                required={!isViewing}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type={isViewing ? "button" : "submit"} // Use button type for viewing mode
              onClick={isViewing ? onClose : undefined} // Close on click if viewing
              disabled={isSubmitDisabled}
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:text-gray-600 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <span>{buttonText}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
