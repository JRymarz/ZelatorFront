import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import LoginSuccess from "./components/LoginSuccess";


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/loginSuccess" element={<LoginSuccess />} />
        </Routes>
    </Router>
  );
}

export default App;
