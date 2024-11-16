import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from "./components/LoginForm";


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<h1>Zelator</h1>} />

            <Route path="/login" element={<LoginForm />} />
        </Routes>
    </Router>
  );
}

export default App;
