import React from 'react'
import { NavLink } from "react-router-dom";
import { IoFastFood } from "react-icons/io5";
import { MdOutlineInventory } from "react-icons/md";
import { TbHandSanitizer } from "react-icons/tb";
import { GiMedicinePills } from "react-icons/gi";
import { MdChair } from "react-icons/md";
import { FaTools } from "react-icons/fa";

const SideBarInventory = () => {
  return (
      <div className="w-25 bg-blue-500 text-white p-6 h-screen rounded-2xl">
        <div className="flex flex-col space-y-6 pt-2">
          <SidebarItem
            to="/inventoryHome"
            icon={<MdOutlineInventory />}
            label="Inventory Home"
          />
          <SidebarItem
            to="/foodAndBeverages"
            icon={<IoFastFood />}
            label="Food & Beverages Items"
          />
          <SidebarItem
            to="/cleaningSupplies"
            icon={<TbHandSanitizer />}
            label="Cleaning Supplies"
          />
          <SidebarItem
            to="/personalCare"
            icon={<GiMedicinePills />}
            label="Personal Care Items"
          />
          <SidebarItem
            to="/furnitureAndElectronics"
            icon={<MdChair />}
            label="Furniture & Electronics Items"
          />
          <SidebarItem
            to="/toolsAndMaintainence"
            icon={<FaTools />}
            label="Tools & Maintainence Items"
          />
        </div>
      </div>
    );

    
}

const SidebarItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-4 group transition-all ${
          isActive
            ? "text-black bg-white bg-opacity-20 rounded-lg px-4 py-2"
            : "text-white group-hover:text-black"
        }`
      }
    >
      <div className="text-3xl group-hover:text-black">{icon}</div>
      <span className="text-xl">{label}</span>
    </NavLink>
  );
};

export default SideBarInventory
