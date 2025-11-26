"use client";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
// NOTE: Assuming WelcomeBanner component exists at the given relative path
import WelcomeBanner from "../../../../components/welcome.jsx";

// --- Reusable Input Component ---
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
        // Tailwind classes for styling
        className="block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  </div>
);

// --- Reusable Textarea Component ---
const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      // Tailwind classes for styling
      className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
  </div>
);
// --- End Reusable Form Components ---

export default function WeeklyEvaluationPage() {
  // Initial state matching the template structure
  const [formData, setFormData] = useState({
    weekEndingDate: "", // For the DATE field
    supervisorName: "",
    taskDescription: "",
    taskStartDate: "",
    taskStartTime: "",
    taskEndDate: "",
    taskEndTime: "",
    isCompleted: "", // 'Y' or 'N'
    methodUsed: "",
    problemsEncountered: "",
    suggestion: "",
    supervisorComment: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: "", text: "" });

    // 💡 Retrieve logged-in user's email from localStorage
    const userData = localStorage.getItem("user");
    let staffEmail = "";
    if (userData) {
      try {
        staffEmail = JSON.parse(userData).email;
      } catch (e) {
        console.error("Failed to parse user email:", e);
      }
    }

    if (!staffEmail) {
      setStatusMessage({
        type: "error",
        text: "User email not found. Please log in again.",
      });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        staffEmail: staffEmail, // Sending the staff member's email
      };

      const response = await fetch("/api/send-evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send combined payload
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Evaluation successfully sent to recipient email!",
        });
        // Optional: Reset form fields here if successful
        // setFormData({ ...initial empty state });
      } else {
        setStatusMessage({
          type: "error",
          text:
            data.message ||
            "Failed to send evaluation email. Check server setup.",
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatusMessage({
        type: "error",
        text: "Network error or server connection failed.",
      });
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-15 text-center">
        WEEKLY TASK COMPLETION AND EVALUATION
      </h1>

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
        {/* 1. Week and Task Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-gray-50">
          <FormInput
            label="Supervisor's Name"
            name="supervisorName"
            value={formData.supervisorName}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Week Ending Date"
            name="weekEndingDate"
            type="date"
            value={formData.weekEndingDate}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Approx. Week No."
            name="weekNumber"
            type="number"
            value={formData.weekNumber}
            onChange={handleChange}
            placeholder="e.g., 5"
            required
          />
        </div>

        {/* 2. Task Details */}
        <FormTextarea
          label="Task Description"
          name="taskDescription"
          value={formData.taskDescription}
          onChange={handleChange}
          placeholder="Describe the main task completed this week."
          rows={3}
          required
        />

        {/* 3. Duration Tracking */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Task Start Date"
            name="taskStartDate"
            type="date"
            value={formData.taskStartDate}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Task End Date"
            name="taskEndDate"
            type="date"
            value={formData.taskEndDate}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Task Start Time"
            name="taskStartTime"
            type="time"
            value={formData.taskStartTime}
            onChange={handleChange}
          />
          <FormInput
            label="Task End Time"
            name="taskEndTime"
            type="time"
            value={formData.taskEndTime}
            onChange={handleChange}
          />
        </div>

        {/* 4. Completion Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Was the task successfully completed?
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="isCompleted"
                value="Y"
                checked={formData.isCompleted === "Y"}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-900">Yes (Y)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isCompleted"
                value="N"
                checked={formData.isCompleted === "N"}
                onChange={handleChange}
                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-900">No (N)</span>
            </label>
          </div>
        </div>

        {/* 5. Method, Problems, Suggestion */}
        <FormTextarea
          label="Method Used"
          name="methodUsed"
          value={formData.methodUsed}
          onChange={handleChange}
          rows={2}
        />
        <FormTextarea
          label="Problems Encountered (Or Reasons why task was not successfully executed)"
          name="problemsEncountered"
          value={formData.problemsEncountered}
          onChange={handleChange}
          rows={3}
        />
        <FormTextarea
          label="Suggestion"
          name="suggestion"
          value={formData.suggestion}
          onChange={handleChange}
          rows={2}
        />

        {/* 6. Supervisor's Comment */}
        <FormTextarea
          label="Supervisor's Comment/Recommendation"
          name="supervisorComment"
          value={formData.supervisorComment}
          onChange={handleChange}
          rows={3}
          required // Assuming this field must be filled by the Admin/Instructor
        />

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>SENDING...</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>SEND EVALUATION</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
