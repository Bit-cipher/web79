"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit2,
  XCircle,
  CheckCircle,
  Loader2,
  Trash2,
  BookOpen,
} from "lucide-react";
// 💡 NOTE: Assuming the modal component has been renamed to CourseFormModal.jsx
import CourseFormModal from "../../../../components/CreateCourseModal";
import WelcomeBanner from "../../../../components/welcome.jsx";

// --- Helper component for the Status Badge (Reused from earlier) ---
const StatusBadge = ({ status }) => {
  const isActive = status === "Active";
  const colorClass = isActive
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
  const Icon = isActive ? CheckCircle : XCircle;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

// 💡 FINAL FIXED HELPER COMPONENT: Mobile Card View for Courses
const CourseCard = ({ course, handleEdit, handleDelete }) => (
  <div
    key={course._id}
    className="bg-white p-4 mb-4 rounded-xl shadow-md border border-gray-200"
  >
    <div className="flex justify-between items-center border-b pb-2 mb-2">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
        {course.name}
      </h3>
      <StatusBadge status={course.status} />
    </div>

    <div className="space-y-2 text-sm">
      {/* Display Instructor and Duration using flex for robust spacing */}
      <p className="flex justify-between">
        <span className="font-medium text-gray-600">Instructor:</span>
        <span className="font-semibold text-gray-800">{course.instructor}</span>
      </p>
      <p className="flex justify-between">
        <span className="font-medium text-gray-600">Duration:</span>
        <span className="font-semibold text-gray-800">{course.duration}</span>
      </p>
      <p className="flex justify-between items-center pt-2 border-t mt-2">
        <span className="font-medium text-gray-600">ID:</span>
        <span className="text-xs text-gray-500">{course._id.slice(-6)}</span>
      </p>
    </div>

    {/* Actions Bar */}
    <div className="flex justify-end space-x-3 mt-3 border-t pt-2">
      <button
        onClick={() => handleEdit(course)}
        className="text-indigo-600 hover:text-indigo-900 flex items-center text-xs"
      >
        <Edit2 className="w-4 h-4 mr-1" /> Edit
      </button>
      <button
        onClick={() => handleDelete(course._id, course.name)}
        className="text-red-600 hover:text-red-900 flex items-center text-xs"
      >
        <Trash2 className="w-4 h-4 mr-1" /> Delete
      </button>
    </div>
  </div>
);

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 💡 STATE: Stores the course object currently being edited (null for creation)
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);

  // Function to fetch data from API (remains unchanged)
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error("Failed to fetch courses:", response.status);
        setCourses([]);
      }
    } catch (error) {
      console.error("Network error fetching courses:", error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on initial load
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handle modal closing and resetting state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null); // Reset editing state when modal closes
  };

  // 💡 ACTION HANDLER: Opens modal in Edit mode
  const handleEdit = (course) => {
    setEditingCourse(course); // Set the specific course data
    setIsModalOpen(true); // Open the modal
  };

  // 💡 ACTION HANDLER: Delete course (remains unchanged)
  const handleDelete = async (courseId, courseName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the course: "${courseName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleteStatus(`Deleting ${courseName}...`);
    try {
      // Call the dynamic DELETE API endpoint
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteStatus(`Success: Course "${courseName}" deleted.`);
        fetchCourses(); // Refresh the list
      } else {
        const errorData = await response.json();
        setDeleteStatus(
          `Error deleting: ${errorData.message || "Server error."}`
        );
      }
    } catch (error) {
      setDeleteStatus("Network error during deletion.");
      console.error("Delete error:", error);
    }

    setTimeout(() => setDeleteStatus(null), 3000);
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <WelcomeBanner />

      {/* Page Header and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">COURSES</h1>

        {/* 💡 Button now opens modal in Creation mode */}
        <button
          onClick={() => {
            setEditingCourse(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Delete Status Message */}
      {deleteStatus && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            deleteStatus.startsWith("Error")
              ? "bg-red-100 text-red-700"
              : deleteStatus.startsWith("Success")
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {deleteStatus}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8 relative max-w-lg">
        <input
          type="text"
          placeholder="Search for course"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      {/* ======================================================= */}
      {/* 💡 Responsive Content Display: Table (Desktop) vs. Card (Mobile) */}
      {/* ======================================================= */}

      {/* Desktop/Tablet View (sm:block) */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "ID",
                "Courses Name",
                "Instructor",
                "Duration",
                "Status",
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
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading courses...
                </td>
              </tr>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course._id.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {course.instructor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={course.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id, course.name)}
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
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <XCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                  No courses found matching &quot;{searchTerm}&quot;.
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
            Loading courses ...
          </div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <XCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
            No courses found matching &quot;{searchTerm}&quot;.
          </div>
        )}
      </div>

      {/* 💡 Render the Course Form Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCourseUpdated={fetchCourses}
        initialData={editingCourse}
      />
    </div>
  );
}
