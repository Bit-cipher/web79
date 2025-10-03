"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CustomSelect from "../../components/customSelect";

const branches = [
  { value: "ibadan", label: "Ibadan" },
  { value: "lokoja", label: "Lokoja" },
  { value: "abuja", label: "Abuja" },
];

export default function Home() {
  // Array of banner images for the form card
  const banners = ["/business.jpg", "/oracle.jpg", "/flyer.jpg"];
  const [currentBanner, setCurrentBanner] = useState(0);

  // Form state
  const [selectedBranch, setSelectedBranch] = useState(branches[0].value);

  // Rotate banner every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Branch:", selectedBranch);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/laptop.jpg')" }}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-0"></div>

      {/* Header */}
      <header className="relative z-10 flex flex-wrap justify-between items-center px-4 sm:px-6 py-3 bg-[#0A1B2A]/80 border-b border-gray-700">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Image
            src="/web79logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="w-7 h-7 sm:w-9 sm:h-9"
          />
          <span className="font-bold text-lg sm:text-xl text-green-500">
            WEB79
          </span>
          <span className="font-bold text-lg sm:text-xl text-orange-400">
            | SMI
          </span>
        </div>
        <Link
          href="/"
          className="mt-2 sm:mt-0 text-sm sm:text-base text-white font-semibold hover:text-green-400"
        >
          home
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 justify-center items-center px-6">
        <div className="bg-[#0A1B2A]/90 shadow-xl rounded-sm w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl min-h-[600px] md:min-h-[800px]">
          {/* Banner image */}
          <div className="relative w-full h-[300px] sm:h-[300px] md:h-[400px] lg:h-[450px] rounded-t-xl overflow-hidden">
            <Image
              src={banners[currentBanner]}
              alt="Banner"
              fill
              className="object-cover transition-all duration-1000"
            />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 sm:p-6 md:p-8 mt-6"
          >
            <input
              type="text"
              placeholder="Enter Your FullName"
              className="w-full p-3 text-sm sm:text-base rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="password"
              placeholder="Enter Your Password"
              className="w-full p-3 text-sm sm:text-base rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <CustomSelect
              label="Select Branch"
              options={branches}
              value={selectedBranch}
              onChange={(option) => setSelectedBranch(option.value)}
              placeholder="Select Branch"
            />

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition"
            >
              LOGIN
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
