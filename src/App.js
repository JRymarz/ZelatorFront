import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import LoginSuccess from "./components/LoginSuccess";
import ProtectedRoutes from "./components/ProtectedRoutes";
import CreateZelator from "./components/CreateZelator";
import NotAuthorized from "./pages/NotAuthorized";
import {UserProvider} from "./context/UserContext";


function App() {
  return (
      <UserProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/loginSuccess" element={<LoginSuccess />} />
                  <Route path="/notAuthorized" element={<NotAuthorized />} />
                  <Route
                      path="/create-zelator"
                      element={
                          <ProtectedRoutes>
                              <CreateZelator />
                          </ProtectedRoutes>
                      }
                  />
              </Routes>
          </Router>
      </UserProvider>
  );
}

export default App;
