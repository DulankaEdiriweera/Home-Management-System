import React from "react";
import SideBarInventory from "./SideBarInventory";
import { IoFastFood } from "react-icons/io5";
import { TbHandSanitizer } from "react-icons/tb";
import { GiMedicinePills } from "react-icons/gi";
import { MdChair } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { Link } from "react-router-dom";

const InventoryHome = () => {
  return (
    <div className="flex p-2">
      {/* Sidebar */}
      <SideBarInventory />
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-200 h-screen rounded-2xl ml-4">
        {/* Heading */}
        <h1 className="text-3xl font-semibold text-gray-700 text-center pt-10">
          "Know what you have, use what you need, save what matters."
        </h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mt-10">
          <Link to="/foodAndBeverages" className="h-full">
            <div className="h-full bg-gradient-to-r from-orange-300 to-red-400 text-white p-6 rounded-2xl shadow-md relative cursor-pointer hover:scale-105 transition-transform duration-200">
              <h2 className="text-lg font-semibold mb-5">FOOD & BEVERAGES</h2>
              <p>GROCERIES (Spices, Vegetables, Fruits etc...)</p>
              <p>DAIRY PRODUCTS</p>
              <p>SNACKS & SWEETS</p>
              <p>BEVERAGES</p>
              <IoFastFood className="absolute bottom-4 right-4 text-8xl" />
            </div>
          </Link>

          <Link to="/cleaningSupplies" className="h-full">
            <div className="h-full bg-gradient-to-r from-blue-300 to-cyan-400 text-white p-6 rounded-2xl shadow-md relative cursor-pointer hover:scale-105 transition-transform duration-200">
              <h2 className="text-lg font-semibold mb-5">CLEANING SUPPLIES</h2>
              <p>HOUSEHOLD CLEANERS</p>
              <p>LAUNDRY PRODUCTS</p>
              <p>DISHWASHING SUPPLIES</p>
              <TbHandSanitizer className="absolute bottom-4 right-4 text-8xl" />
            </div>
          </Link>

          <Link to="/personalCare" className="h-full">
            <div className="h-full bg-gradient-to-r from-pink-300 to-purple-400 text-white p-6 rounded-2xl shadow-md relative cursor-pointer hover:scale-105 transition-transform duration-200">
              <h2 className="text-lg font-semibold mb-5">
                PERSONAL CARE ITEMS
              </h2>
              <p>TOILETRIES</p>
              <p>SKINCARE</p>
              <p>HAIRCARE</p>
              <p>HEALTH ITEMS</p>
              <GiMedicinePills className="absolute bottom-4 right-4 text-8xl" />
            </div>
          </Link>

          <Link to="/furnitureAndElectronics" className="h-full">
            <div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 text-white p-6 rounded-2xl shadow-md relative cursor-pointer hover:scale-105 transition-transform duration-200">
              <h2 className="text-lg font-semibold mb-5">
                HOUSEHOLD ITEMS
              </h2>
              <p>FURNITURE</p>
              <p>ELECTRONIC ITEMS</p>
              <p>KITCHEN ITEMS</p>
              <p>LIGHTINGS</p>
              <MdChair className="absolute bottom-4 right-4 text-8xl" />
            </div>
          </Link>

          <Link to="/toolsAndMaintainence" className="h-full">
            <div className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 text-white p-6 rounded-2xl shadow-md relative cursor-pointer hover:scale-105 transition-transform duration-200">
              <h2 className="text-lg font-semibold mb-5">
                TOOLS & MAINTENANCE ITEMS
              </h2>
              <p>HAND TOOLS</p>
              <p>POWER TOOLS</p>
              <p>HOME REPAIR TOOLS</p>
              <p>HEALTH CHECKING TOOLS</p>
              <FaTools className="absolute bottom-4 right-4 text-8xl" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InventoryHome;
