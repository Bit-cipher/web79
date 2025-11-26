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

// Helper for formatting currency (using NGN symbol)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// 💡 UPDATED HELPER COMPONENT: Mobile Card View for Students
const StudentCard = ({
  student,
  handleView,
  handleEdit,
  handleDelete,
  formatCurrency,
}) => (
  <div
    key={student._id}
    className="bg-white p-4 mb-4 rounded-xl shadow-md border border-gray-200"
  >
    <div className="flex justify-between items-center border-b pb-2 mb-2">
      <h3 className="text-lg font-bold text-gray-800">{student.fullName}</h3>
      <span className="text-xs font-medium text-gray-500">
        ID: {student._id.slice(-4)}
      </span>
    </div>

    <div className="space-y-1 text-sm">
      <p>
        <span className="font-medium text-gray-600">Email:</span>{" "}
        <span className="text-indigo-600">{student.email}</span>
      </p>
      <p>
        <span className="font-medium text-gray-600">Course:</span>{" "}
        {student.course}
      </p>
      <p className="flex justify-between">
        <span className="font-medium text-gray-600">Agreed:</span>{" "}
        <span>{formatCurrency(student.amountAgreed)}</span>
      </p>
      <p className="flex justify-between">
        <span className="font-medium text-gray-600">Paid:</span>{" "}
        <span className="text-green-600">
          {formatCurrency(student.firstPayment)}
        </span>
      </p>
      <p className="flex justify-between items-center pt-1 border-t mt-2">
        <span className="font-bold text-gray-700">Balance:</span>
        <span
          className="font-bold"
          style={{ color: student.balance > 0 ? "#dc2626" : "#10b981" }}
        >
          {formatCurrency(student.balance)}
        </span>
      </p>
      <p className="flex justify-between items-center">
        {/* 💡 Label changed to "Paid" */}
        <span className="font-bold text-gray-700">Paid:</span>
        {student.fullyPaid ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
      </p>
    </div>

    {/* Actions Bar */}
    <div className="flex justify-end space-x-3 mt-3 border-t pt-2">
      <button
        onClick={() => handleView(student)}
        className="text-gray-500 hover:text-gray-900 flex items-center text-xs"
      >
        <Eye className="w-4 h-4 mr-1" /> View
      </button>
      <button
        onClick={() => handleEdit(student)}
        className="text-indigo-600 hover:text-indigo-900 flex items-center text-xs"
      >
        <Edit2 className="w-4 h-4 mr-1" /> Edit
      </button>
      <button
        onClick={() => handleDelete(student._id, student.fullName)}
        className="text-red-600 hover:text-red-900 flex items-center text-xs"
      >
        <Trash2 className="w-4 h-4 mr-1" /> Delete
      </button>
    </div>
  </div>
);

export default function ViewAllStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // ... (fetchStudents, handleDelete, handleEdit, handleView, handleCloseModal logic remain the same) ...
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

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (studentId, studentName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete student: "${studentName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setStatusMessage({ type: "loading", text: `Deleting ${studentName}...` });
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: `Success: Student "${studentName}" deleted.`,
        });
        fetchStudents();
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

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleView = (student) => {
    setEditingStudent(student);
    setIsReadOnly(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setIsReadOnly(false);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(student._id).includes(searchTerm)
  );

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

        {/* 💡 Add New Student Button: Text is now always visible */}
        <Link href="/admin/register">
          <button className="flex items-center space-x-2 px-2 py-2 bg-green-600 text-white font-small rounded-lg shadow hover:bg-green-700 transition">
            <Plus className="w-5 h-5" />
            <span>Add New Student</span> {/* 💡 Removed hidden sm:inline */}
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

      {/* ======================================================= */}
      {/* Responsive Content Display: Table (Desktop) vs. Card (Mobile) */}
      {/* ======================================================= */}

      {/* Desktop/Tablet View (sm:block) */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "Name",
                "Email",
                "Course",
                "Amount Agreed",
                "Amount Paid",
                "Balance",
                "Paid", // 💡 Updated Header
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {student.fullyPaid ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(student)}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
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
                  No students found matching &quot;{searchTerm}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (hidden on sm and above) */}
      <div className="sm:hidden">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading student data ...
          </div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              handleView={handleView}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              formatCurrency={formatCurrency}
            />
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <XCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
            No students found matching &quot;{searchTerm}&quot;.
          </div>
        )}
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
