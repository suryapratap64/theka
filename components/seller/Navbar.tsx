"use client";

import React from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { useAppContext } from "../../context/AppContext";

const Navbar: React.FC = () => {
  const { router } = useAppContext();

  return (
    <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b">
      {/* <Image
        onClick={() => router.push("/")}
        className="w-28 lg:w-32 cursor-pointer"
        src={assets.logo}
        alt="logo"
      /> */}
        <h1   onClick={() => router.push("/")}  className="cursor-pointer text-orange-600 text-2xl font-serif  w-28 md:w-32">QuickMart</h1>
      
      <button className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
