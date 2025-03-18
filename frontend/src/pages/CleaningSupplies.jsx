import React from 'react'
import SideBarInventory from '../components/SideBarInventory';

const CleaningSupplies = () => {
  return (
    <div className="flex p-2">
      {/* Sidebar */}
      <SideBarInventory />
      {/* Main Content */}

      <div className="flex-1 p-6 bg-gray-100 h-screen rounded-lg ml-4">
        <h1 className="text-3xl font-bold text-gray-900">CLEANING SUPPLIES</h1>
      </div>
    </div>
  )
}

export default CleaningSupplies
