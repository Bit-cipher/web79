"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomSelect from "../../../components/customSelect";

// Convert arrays to objects with { value, label }
const courses = [
  { value: "web-development", label: "Web Development" },
  { value: "app-development", label: "App Development" },
  { value: "digital-marketing", label: "Digital Marketing" },
];

const paymentTypes = [
  { value: "full-payment", label: "Full Payment" },
  { value: "installment", label: "Installment" },
];

const branches = [
  { value: "ibadan", label: "Ibadan" },
  { value: "lokoja", label: "Lokoja" },
  { value: "abuja", label: "Abuja" },
];

export default function Register() {
  const banners = ["/business.jpg", "/oracle.jpg", "/flyer.jpg"];
  const [currentBanner, setCurrentBanner] = useState(0);

  const [selectedCourse, setSelectedCourse] = useState(courses[0].value);
  const [selectedPayment, setSelectedPayment] = useState(paymentTypes[0].value);
  const [selectedBranch, setSelectedBranch] = useState(branches[0].value);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Branch:", selectedBranch);
    console.log("Selected Course:", selectedCourse);
    console.log("Selected Payment:", selectedPayment);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/laptop.jpg')" }}
    >
      <div className="fixed inset-0 bg-black/60 z-0"></div>

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
          href="/form"
          className="mt-2 sm:mt-0 text-sm sm:text-base text-white font-semibold hover:text-green-400"
        >
          register
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 justify-center items-center px-6 py-10">
        <div className="bg-[#0A1B2A]/90 shadow-xl rounded-sm w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl min-h-[600px] md:min-h-[800px]">
          <div className="relative w-full h-[300px] sm:h-[300px] md:h-[400px] lg:h-[450px] rounded-t-xl overflow-hidden">
            <Image
              src={banners[currentBanner]}
              alt="Banner"
              fill
              className="object-cover transition-all duration-1000"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-8">
            <input
              type="text"
              placeholder="Enter Your FullName"
              className="w-full p-3 rounded-lg bg-white/10 text-white"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/10 text-white"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 rounded-lg bg-white/10 text-white"
            />
            <input
              type="text"
              placeholder="Next of Kin No."
              className="w-full p-3 rounded-lg bg-white/10 text-white"
            />

            <CustomSelect
              placeholder="Select Course"
              options={courses}
              value={selectedCourse}
              onChange={(option) => setSelectedCourse(option.value)}
            />

            <CustomSelect
              placeholder="Payment Type"
              options={paymentTypes}
              value={selectedPayment}
              onChange={(option) => setSelectedPayment(option.value)}
            />

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition"
            >
              REGISTER
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
