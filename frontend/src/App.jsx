import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TaskPage from "./pages/TaskPage";

const App = () => {
  return <div className="mx-4 sm:mx-[1%]">
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/tasks" element={<TaskPage />} />
    </Routes>
    <Footer />
  </div>;
};

export default App;
