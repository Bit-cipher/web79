// app/admin/layout.js
"use client";
import CreateAdminModal from "../../../components/CreateAdminModal.jsx";
import Sidebar from "../../../components/sideBar.jsx";
import { useState, useEffect } from "react";
import { User, ChevronDown, Menu, X, LogOut, Briefcase } from "lucide-react"; // Import icons
import Image from "next/image";

export default function AdminLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 💡 New state for profile dropdown
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    fullName: "Guest",
    email: "", // Added email for display in dropdown
    branch: "", // Added branch for display in dropdown
    role: "N/A",
  });
  const [avatarUrl, setAvatarUrl] = useState("");

  // Fetch user data and generate avatar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const nameOrEmail = user.fullName || user.email;

          if (nameOrEmail) {
            const formattedRole = user.role
              .replace("-", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            setCurrentUser({
              fullName: user.fullName,
              email: user.email, // Store email
              branch: user.branch, // Store branch
              role: formattedRole,
            });

            const seed = encodeURIComponent(nameOrEmail);
            setAvatarUrl(
              `https://api.dicebear.com/8.x/initials/svg?seed=${seed}&backgroundColor=4f46e5,3b82f6&fontSize=45`
            );
          }
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
        }
      }
    }
  }, []);

  const finalAvatarUrl =
    avatarUrl || "https://api.dicebear.com/8.x/initials/svg?seed=Guest";

  // Function to handle logout (reused from Sidebar)
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/"; // Simple hard redirect to root login page
  };

  return (
    // Set the main container height to viewport height (h-screen)
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Component */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 lg:relative lg:translate-x-0 lg:w-64`}
      >
        <Sidebar
          onOpenCreateAdmin={() => {
            setIsModalOpen(true);
            setIsSidebarOpen(false);
          }}
          onLinkClick={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header/Profile Bar (Sticky) */}
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-indigo-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Page Title (Hidden on large screens where sidebar title exists) */}
          <h1 className="text-xl font-semibold text-gray-800 lg:hidden">
            Admin Portal
          </h1>

          {/* Profile Section (Right Side - Desktop/Mobile Toggle) */}
          <div className="ml-auto relative">
            {" "}
            {/* Added relative for dropdown positioning */}
            <div
              className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
              // 💡 Toggle dropdown state
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              {/* Name and Role (Hidden on mobile screens, shown on sm+) */}
              <div className="text-right leading-tight hidden sm:block">
                <span className="block text-sm font-medium text-gray-700">
                  {currentUser.fullName}
                </span>
                <span className="block text-xs font-semibold text-indigo-600">
                  {currentUser.role}
                </span>
              </div>

              {/* Avatar Image */}
              <Image
                src={finalAvatarUrl}
                alt={`${currentUser.fullName} Avatar`}
                width={32}
                height={32}
                unoptimized
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />

              {/* Chevron Icon - Rotates when open */}
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transform transition duration-200 ${
                  isProfileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {/* 💡 Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                // Close dropdown if user clicks outside the profile box
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                {/* Header Details (Always visible in dropdown) */}
                <div className="p-4 border-b bg-gray-50">
                  <p className="font-semibold text-gray-900">
                    {currentUser.fullName}
                  </p>
                  <p className="text-xs text-indigo-600 flex items-center mt-1">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {currentUser.role} @ {currentUser.branch || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentUser.email}
                  </p>
                </div>

                {/* Action Link: Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content - This is where the long content lives */}
        <div className="p-6 flex-1">{children}</div>
      </main>

      <CreateAdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsProfileDropdownOpen(false);
        }}
      />
    </div>
  );
}
