import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WelcomeView } from "../welcome-view/welcome-view";
import { TestingView } from "../testing-view/testing-view";
import React from "react";

export const MainView = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeView/>}/>
        <Route path="/test" element={<TestingView/>}/>
      </Routes>
    </BrowserRouter>
  );
};