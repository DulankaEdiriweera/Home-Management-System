import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return <div className="mx-4 sm:mx-[10%]">
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
    </Routes>
    <Footer/>
  </div>;
};

export default App;
