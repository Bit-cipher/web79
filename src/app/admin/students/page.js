"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  XCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import WelcomeBanner from "../../../../components/welcome.jsx";
// 💡 Import the student form modal
import StudentFormModal from "../../../../components/StudentsFormModal.jsx";

// Helper for formatting currency (using NGN symbol)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function ViewAllStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null); // For delete/fetch feedback

  // State for Edit/View Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false); // New state to lock form for viewing

  // 💡 Function to fetch student data from API
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call the MongoDB API route for students
      const response = await fetch("/api/students");
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Failed to fetch students:", response.status);
        setStudents([]);
        setStatusMessage({
          type: "error",
          text: "Failed to load student list from server.",
        });
      }
    } catch (error) {
      console.error("Network error fetching students:", error);
      setStudents([]);
      setStatusMessage({
        type: "error",
        text: "Network error. Could not connect to database.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on initial load
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // 💡 ACTION HANDLER: Delete student
  const handleDelete = async (studentId, studentName) => {
    // NOTE: Authorization check for super-admin role must be done on the backend API
    if (
      !window.confirm(
        `Are you sure you want to delete student: "${studentName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setStatusMessage({ type: "loading", text: `Deleting ${studentName}...` });
    const token = localStorage.getItem("authToken"); // Get token for auth header

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Send JWT for Super Admin check
        },
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: `Success: Student "${studentName}" deleted.`,
        });
        fetchStudents(); // Refresh the list
      } else {
        const errorData = await response.json();
        setStatusMessage({
          type: "error",
          text: `Error deleting: ${errorData.message || "Server error."}`,
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Network error during deletion.",
      });
      console.error("Delete error:", error);
    }

    setTimeout(() => setStatusMessage(null), 4000);
  };

  // 💡 ACTION HANDLER: Opens modal in Edit mode
  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsReadOnly(false); // Enable editing
    setIsModalOpen(true);
  };

  // 💡 ACTION HANDLER: Opens modal in Read-Only mode
  const handleView = (student) => {
    setEditingStudent(student);
    setIsReadOnly(true); // Disable editing (Read-Only)
    setIsModalOpen(true);
  };

  // Handle modal closing and resetting state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setIsReadOnly(false); // Reset read-only state
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(student._id).includes(searchTerm)
  );

  // Dynamic status message class
  const statusClasses =
    statusMessage?.type === "success"
      ? "bg-green-100 text-green-700"
      : statusMessage?.type === "error"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <WelcomeBanner />

      {/* Page Header and Add Button */}
      <div className="flex justify-between items-center mb-6 mt-15">
        <h1 className="text-2xl font-bold text-gray-800">STUDENTS</h1>
        {/* Link to the Register Student page */}
        <Link href="/admin/register">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition">
            <Plus className="w-5 h-5" />
            <span>Add New Student</span>
          </button>
        </Link>
      </div>

      {/* Status Message Display (Delete Feedback/Errors) */}
      {statusMessage && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium border-l-4 border-current ${statusClasses}`}
        >
          {statusMessage.type === "loading" && (
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8 relative max-w-lg">
        <input
          type="text"
          placeholder="Search by name, email or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "Name",
                "Email",
                "Course",
                "Amount Agreed",
                "Amount Paid", // 💡 Renamed Header
                "Balance",
                "Fully Paid",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading student data ...
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student._id.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatCurrency(student.amountAgreed)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatCurrency(student.firstPayment)}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-semibold"
                    style={{
                      color: student.balance > 0 ? "#dc2626" : "#10b981",
                    }}
                  >
                    {formatCurrency(student.balance)}
                  </td>
                  {/* 💡 Fully Paid Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {student.fullyPaid ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                  {/* Action Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {/* 💡 VIEW Button */}
                      <button
                        onClick={() => handleView(student)}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {/* EDIT Button */}
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {/* DELETE Button */}
                      <button
                        onClick={() =>
                          handleDelete(student._id, student.fullName)
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <XCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                  No students found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 💡 Render StudentFormModal */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStudentUpdated={fetchStudents}
        initialData={editingStudent}
        isReadOnly={isReadOnly} // Pass the read-only state to the modal
      />
    </div>
  );
}
