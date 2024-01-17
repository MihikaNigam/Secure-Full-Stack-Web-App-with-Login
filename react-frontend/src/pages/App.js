import { Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./Home/Home";
import { Landing } from "./Landing/Landing";
import { ProtectedRoute } from "../utils/ProtectedRoute";
import React from "react";
import { useAuth } from "../context/AuthProvider";
import { AuthProvider } from "../context/AuthProvider";
import { Login } from "./Login/Login";
import { Signup } from "./Signup/Signup";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Navigation />
        <h1>React Router</h1>
        <Routes>
          <Route index element={<Home />} />
          <Route
            exact
            path="landing"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />
          {/* <Route path="landing" element={<Landing />} /> */}
          <Route exact path="home" element={<Home />} />
          <Route exact path="home/login" element={<Login />} />
          <Route exact path="home/signup" element={<Signup />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </AuthProvider>
    </>
  );
};

const Navigation = () => {
  const { value } = useAuth();
  return (
    <nav>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/landing">Landing</NavLink>
      {value.token && (
        <button type="button" onClick={value.onLogout}>
          Sign Out
        </button>
      )}
    </nav>
  );
};

export default App;
