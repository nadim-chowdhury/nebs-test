"use client";

import Image from "next/image";
import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full h-20 bg-white border-b flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex flex-col">
        <h1 className="text-sm font-semibold text-gray-900">
          Good Afternoon Asif
        </h1>
        <p className="text-xs text-gray-500">13 June, 2026</p>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        {/* Divider */}
        <span className="h-6 w-px bg-gray-300" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Asif Riaj</p>
            <p className="text-xs text-gray-500">Hr</p>
          </div>

          <Image
            src="/assets/avatar.png"
            alt="User Avatar"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
