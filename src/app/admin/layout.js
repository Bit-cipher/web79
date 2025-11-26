// app/admin/layout.js
"use client";
import CreateAdminModal from "../../../components/CreateAdminModal.jsx";
import Sidebar from "../../../components/sideBar.jsx";
import { useState, useEffect } from "react";
import { User, ChevronDown } from "lucide-react"; // Import icons

export default function AdminLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    fullName: "Guest",
    role: "N/A",
  });

  // 1. Fetch user data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // Check if data exists before setting state
          if (user.fullName) {
            setCurrentUser({
              fullName: user.fullName,
              // Format the role (e.g., 'super-admin' -> 'Super Admin')
              role: user.role
                .replace("-", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
            });
          }
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
        }
      }
    }
  }, []); // Run once on mount

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onOpenCreateAdmin={() => setIsModalOpen(true)} />

      <main className="flex-1 overflow-y-auto">
        {/* Top Header/Profile Bar */}
        <header className="flex justify-end items-center p-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {/* User Name and Role */}
            <div className="text-right leading-tight">
              <span className="block text-sm font-medium text-gray-700">
                {currentUser.fullName}
              </span>
              <span className="block text-xs font-semibold text-indigo-600">
                {currentUser.role}
              </span>
            </div>

            {/* Avatar Placeholder (User Icon) */}
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-4 h-4" />
            </div>

            {/* Dropdown Chevron */}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>

      {/* 2. Render the Modal component */}
      <CreateAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
