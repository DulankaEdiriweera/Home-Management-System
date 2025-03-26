import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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
import MonthlyBudget from "./pages/MonthlyBudgetPage";

import ShoppingList from "./pages/shoppingList";
import AddItem from "./pages/AddItem";
import RecipeGenerator from "./pages/RecipeGenerator";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import TaskProgressPage from "./pages/TaskProgressPage";


const App = () => {
  return (
    <div className="max-w-screen">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/inventoryHome" element={<InventoryHome />} />
          <Route path="/foodAndBeverages" element={<FoodAndBeverages />} />
          <Route path="/cleaningSupplies" element={<CleaningSupplies />} />
          <Route path="/personalCare" element={<PersonalCare />} />
          <Route path="/furnitureAndElectronics" element={<FurnitureAndElectronics />} />
          <Route path="/toolsAndMaintainence" element={<ToolsAndMaintainence />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/expenses" element={<ExpensesHome />} />
          <Route path="/expensesAdd" element={<ExpenseForm />} />
          <Route path="/monthlyBudget" element={<MonthlyBudget />} />
          <Route path="/shoppingList" element={<ShoppingList />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/recipe-suggestions" element={<RecipeGenerator />} />
          <Route path="/task-progress" element={<TaskProgressPage />} />
        </Route>
        {/* Catch-all for unrecognized routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Footer />
    </div>
  );

};

export default App;
