// components/Navbar.tsx
"use client";

import { useState } from "react";
import { Bell, MessageSquare, Search, Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-xl font-bold text-blue-600">
            E-Learn
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/courses" className="hover:text-blue-600">Courses</a>
            <a href="/categories" className="hover:text-blue-600">Categories</a>

            <Search className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <MessageSquare className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <Bell className="w-5 h-5 cursor-pointer hover:text-blue-600" />

            {/* Profile with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <Image
                  src="/profile.jpg"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer"
                />
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                  <a href="/account" className="block px-4 py-2 hover:bg-gray-100">
                    My Account
                  </a>
                  <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                    Settings
                  </a>
                  <a href="/logout" className="block px-4 py-2 hover:bg-gray-100 text-red-500">
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-4 pb-2 space-y-4">
            <a href="/courses" className="block hover:text-blue-600">Courses</a>
            <a href="/categories" className="block hover:text-blue-600">Categories</a>

            <div className="flex space-x-4 mt-2">
              <Search className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              <MessageSquare className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              <Bell className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            </div>

            {/* Profile Dropdown for Mobile */}
            <div className="border-t pt-4">
              <a href="/account" className="block px-2 py-2 hover:bg-gray-100">
                My Account
              </a>
              <a href="/settings" className="block px-2 py-2 hover:bg-gray-100">
                Settings
              </a>
              <a href="/logout" className="block px-2 py-2 hover:bg-gray-100 text-red-500">
                Logout
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
