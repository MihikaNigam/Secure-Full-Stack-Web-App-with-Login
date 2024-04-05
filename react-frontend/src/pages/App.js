import { Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./Home/Home";
import { Landing } from "./Landing/Landing";
import { ProtectedRoute } from "../utils/ProtectedRoute";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { AuthProvider } from "../context/AuthProvider";
import { Login } from "./Login/Login";
import { Signup } from "./Signup/Signup";
import cookie from "react-cookies";

const App = () => {
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("cookie");
    const user=urlParams.get("user");

    if (token && !cookie.load("auth-session")) {
      cookie.save("auth-session", token, { path: "/" });
      cookie.save("user", user, { path: "/" });
      window.location.reload();
    }
  });
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
  const session = cookie.load("auth-session");
  const { value } = useAuth();
  return (
    <nav>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/landing">Landing</NavLink>
      {session && (
        <button type="button" onClick={value.onLogout}>
          Sign Out
        </button>
      )}
    </nav>
  );
};

export default App;
