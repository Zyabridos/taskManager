"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import NavbarButtons from "../Buttons/Buttons";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-md">
      <nav className="w-100 container mx-auto flex flex-wrap items-center justify-between py-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            {t('taskManager')}
          </Link>
          <Link href="/users" className="text-lg text-gray-700 hover:text-gray-900 transition">
            {t('layouts.application.users')}
          </Link>
        </div>
        
        <button
          className="block lg:hidden text-gray-800 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        <div className="hidden lg:flex items-center space-x-4">
          <NavbarButtons />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
