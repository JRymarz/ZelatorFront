import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./components/HomePage";
import LoginForm from "./components/LoginForm";
import LoginSuccess from "./components/LoginSuccess";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ProtectedRoutesForZelator from "./components/ProtectedRoutesForZelator";
import CreateZelator from "./components/CreateZelator";
import NotAuthorized from "./pages/NotAuthorized";
import {UserProvider} from "./context/UserContext";
import CreateUser from "./components/CreateUser";
import CreateGroup from "./components/CreateGroup";
import Members from "./components/Members";
import MyRose from "./components/MyRose";
import PlanMysteryChange from "./components/PlanMysteryChange";
import DashboardZelator from "./components/DashboardZelator";


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
                  <Route
                    path="/create-user"
                    element={
                      <ProtectedRoutesForZelator>
                          <CreateUser />
                      </ProtectedRoutesForZelator>
                    }
                  />
                  <Route
                      path="/create-group"
                      element={
                          <ProtectedRoutesForZelator>
                              <CreateGroup />
                          </ProtectedRoutesForZelator>
                      }
                  />
                  <Route
                      path="/members"
                      element={
                          <ProtectedRoutesForZelator>
                              <Members />
                          </ProtectedRoutesForZelator>
                      }
                  />
                  <Route
                      path="/my-rose"
                      element={
                          <ProtectedRoutesForZelator>
                              <MyRose />
                          </ProtectedRoutesForZelator>
                      }
                  />
                  <Route
                      path="/mystery-change"
                      element={
                          <ProtectedRoutesForZelator>
                              <PlanMysteryChange />
                          </ProtectedRoutesForZelator>
                      }
                  />
                  <Route
                      path="/zelator"
                      element={
                          <ProtectedRoutesForZelator>
                              <DashboardZelator />
                          </ProtectedRoutesForZelator>
                      }
                  />
              </Routes>
          </Router>
      </UserProvider>
  );
}

export default App;
