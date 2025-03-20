import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import InventoryHome from "./components/InventoryHome";
import FoodAndBeverages from "./pages/FoodAndBeverages";
import CleaningSupplies from "./pages/CleaningSupplies";
import PersonalCare from "./pages/PersonalCare";
import FurnitureAndElectronics from "./pages/FurnitureAndElectronics";
import ToolsAndMaintainence from "./pages/ToolsAndMaintainenceItems"
import TaskPage from "./pages/TaskPage";
import ExpensesHome from "./pages/ExpensesHome";
import ExpenseForm from "./pages/ExpensesForm";


const App = () => {
  return (
    <div className="mx-4 sm:mx-[1%]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventoryHome" element={<InventoryHome />} />
        <Route path="/foodAndBeverages" element={<FoodAndBeverages />} />
        <Route path="/cleaningSupplies" element={<CleaningSupplies />} />
        <Route path="/personalCare" element={<PersonalCare />} />
        <Route
          path="/furnitureAndElectronics"
          element={<FurnitureAndElectronics />}
        />
        <Route path="/toolsAndMaintainence" element={<ToolsAndMaintainence />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/expenses" element={<ExpensesHome/>} />
        <Route path="/expensesAdd" element={<ExpenseForm/>} />
        
        
      </Routes>
      <Footer />
    </div>
  );

};

export default App;
