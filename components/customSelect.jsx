"use client";
import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange && onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;
  const isFloating = isOpen || !!selectedLabel; // Label floats if dropdown open or value selected

  return (
    <div className="w-full relative">
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-pointer rounded-lg bg-white/5 py-3 pl-3 pr-10 text-left text-white shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
      >
        {/* Floating label */}
        <span
          className={`absolute left-3 text-xs text-gray-400 transition-all duration-200 ease-in-out
            ${isFloating ? "-top-2 text-green-400" : "top-3"}
          `}
        >
          {placeholder}
        </span>

        {/* Selected value */}
        <span className={`block truncate ${isFloating ? "mt-2" : ""}`}>
          {selectedLabel || ""}
        </span>

        {/* Dropdown icon */}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-300" />
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-black/90 rounded-md shadow-lg max-h-60 overflow-auto text-base sm:text-sm">
          {options.map((option) => (
            <li
              key={option.value}
              className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                value === option.value
                  ? "bg-green-600 text-white"
                  : "text-white"
              } hover:bg-green-500 hover:text-white`}
              onClick={() => handleSelect(option)}
            >
              <span className="block truncate">{option.label}</span>
              {value === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <CheckIcon className="h-5 w-5 text-white" />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
