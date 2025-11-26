// app/admin/page.js
import { DollarSign, Users, BookOpen, Clock } from "lucide-react"; // Example icons
import Link from "next/link";
import Image from "next/image";
import WelcomeBanner from "../../../components/welcome.jsx";

// Widget component for consistency
const StatCard = ({ title, value, icon: Icon, bgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
    <div className={`p-3 rounded-full ${bgColor} text-white mb-3`}>
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
  </div>
);

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      <WelcomeBanner />

      {/* Key Metrics Cards (More robust with icons and color) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value="120"
          icon={Users}
          bgColor="bg-indigo-500"
        />
        <StatCard
          title="Total Courses"
          value="20"
          icon={BookOpen}
          bgColor="bg-green-500"
        />
        <StatCard
          title="New Enquiries"
          value="14"
          icon={Clock}
          bgColor="bg-yellow-500"
        />
        <StatCard
          title="Total Revenue"
          value="₦1.2M"
          icon={DollarSign}
          bgColor="bg-red-500"
        />
      </div>

      {/* Charts and Activity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Chart Widget (Larger space) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Enrollment Trends
          </h3>
          {/* Placeholder for Chart component (e.g., Recharts/Nivo) */}
          <div className="h-64 flex items-center justify-center bg-gray-50 border border-dashed rounded-lg text-gray-400">
            [ Enrollment Line Chart Placeholder ]
          </div>
        </div>

        {/* Recent Enquiries Widget */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Enquiries
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b pb-2">
              <span>Jane Doe - Web Dev</span>
              <span className="text-xs text-gray-500">2h ago</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span>Kunle Obi - Digital Mkt</span>
              <span className="text-xs text-gray-500">5h ago</span>
            </li>
            <li className="flex justify-between border-b pb-2">
              <span>Aisha T. - Data Analysis</span>
              <span className="text-xs text-gray-500">1d ago</span>
            </li>
            {/* ... more list items ... */}
          </ul>
          <Link
            href="/admin/enquiries"
            className="mt-4 block text-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View All Enquiries →
          </Link>
        </div>
      </div>
    </div>
  );
}
