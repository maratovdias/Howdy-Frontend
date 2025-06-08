import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContainer from "./components/AppContainer";
import Navbar from "./components/Navbar";
import ChatPage from "./pages/ChatPage";
import HomePage from "./components/HomePage"; // Добавляем импорт

function App() {
  return (
        <AppContainer/>
  );
}

export default App;
