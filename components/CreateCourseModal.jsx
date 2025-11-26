"use client";
import { useState, useEffect } from "react";
import { BookOpen, Loader2, X, AlertTriangle } from "lucide-react";

// --- Reusable Form Components (Assumed defined elsewhere) ---
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

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Upcoming", label: "Upcoming" },
];

const initialFormState = {
  name: "",
  instructor: "",
  duration: "",
  status: STATUS_OPTIONS[0].value,
};

export default function CourseFormModal({
  isOpen,
  onClose,
  onCourseUpdated,
  initialData,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const isEditing = !!initialData?._id; // Determine if we are in Edit mode

  // 💡 Effect to load initial data when prop changes (for editing)
  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData({
        name: initialData.name || "",
        instructor: initialData.instructor || "",
        duration: initialData.duration || "",
        status: initialData.status || STATUS_OPTIONS[0].value,
      });
    } else {
      setFormData(initialFormState);
    }
    setStatusMessage({ type: "", text: "" }); // Clear messages on open/mode switch
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    // Determine API path and method
    const apiPath = isEditing
      ? `/api/courses/${initialData._id}`
      : "/api/courses";
    const method = isEditing ? "PATCH" : "POST";

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
            ? `Course "${formData.name}" updated successfully.`
            : `Course "${formData.name}" created successfully.`,
        });
        if (!isEditing) {
          setFormData(initialFormState); // Clear form only for creation
        }
        onCourseUpdated(); // Notify parent to refresh the list
        setTimeout(onClose, 2000); // Close after 2 seconds
      } else {
        setStatusMessage({
          type: "error",
          text:
            data.message ||
            `Failed to ${isEditing ? "update" : "create"} course.`,
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

  const modalTitle = isEditing
    ? `EDIT COURSE: ${initialData.name}`
    : "ADD NEW COURSE";
  const buttonText = isEditing ? "SAVE CHANGES" : "CREATE COURSE";

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
            <BookOpen className="w-5 h-5 text-green-600" />
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

        {/* Warning for ID in Edit mode */}
        {isEditing && (
          <div className="p-4 mx-6 mt-4 bg-yellow-100 text-yellow-700 rounded-lg flex items-start space-x-2 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
            <p>Editing Course ID: **{initialData._id.slice(-6)}**</p>
          </div>
        )}

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              label="Course Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Python for Data Analysis"
              required
            />
            <FormInput
              label="Instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="e.g., Jane Doe"
              required
            />
            <FormInput
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 4 Months"
              required
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-green-400"
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
