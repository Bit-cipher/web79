"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// NOTE: This component MUST receive onOpenCreateAdmin and onLinkClick from the parent layout
export default function Sidebar({ onOpenCreateAdmin, onLinkClick }) {
  const pathname = usePathname();
  const router = useRouter();

  const [userRole, setUserRole] = useState(null);

  // Fetch user role from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserRole(user.role);
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
        }
      }
    }
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "🏠" },
    { name: "Register", href: "/admin/register", icon: "➕" },
    { name: "Students", href: "/admin/students", icon: "👥" },
    { name: "Courses", href: "/admin/courses", icon: "📚" },
    { name: "Weekly Evaluation", href: "/admin/evaluation", icon: "✉️" },
  ];

  const adminCreationLink = {
    name: "Create Admin",
    icon: "👤",
  };

  const handleLogout = () => {
    // Clear stored authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Ensure modal closes and trigger link click for mobile menu close
    if (onLinkClick) {
      onLinkClick();
    }
    // Redirect to login page
    router.push("/");
  };

  // Handler for all navigation links
  const handleNavLinkClick = () => {
    // 💡 Call the function passed from the layout to close the mobile menu
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white h-screen border-r border-gray-200">
      {/* Admin Logo/Header */}
      <div className="p-6 text-center text-xl font-bold text-[#1a202c]">
        <div className="flex items-center  space-x-2 sm:space-x-3">
          <Image
            src="/web79logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-16 h-16 sm:w-16 sm:h-16"
          />
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-16 h-16 sm:w-16 sm:h-16"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              // 💡 Attach handler to close menu after navigation
              onClick={handleNavLinkClick}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-indigo-700"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Container for Create Admin and Logout */}
      <div className="p-4 border-t border-gray-200">
        {/* Create Admin Button (Visible to all admins) */}
        <button
          onClick={() => {
            onOpenCreateAdmin(); // Open the modal
            handleNavLinkClick(); // Close the sidebar immediately
          }}
          className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors 
                        text-gray-600 hover:bg-gray-100 hover:text-indigo-700 mb-2`}
        >
          <span className="mr-2">👤</span>
          {adminCreationLink.name}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
