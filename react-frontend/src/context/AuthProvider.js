import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/AuthApi";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (formdata) => {
    try {
      const res = await authApi.post("/signin", formdata);
      if (res.status === 200) {
        const token = res.data.body.token;
        setToken(token);
        navigate("/landing");
      }
    } catch (error) {
      console.log("error? ", error);
      return error.message;
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  const handleSignup = async (formdata) => {
    try {
      const res = await authApi.post("/signup", formdata);
      console.log(res);
      if (res.status === 200) {
        navigate("/home/login");
      }
    } catch (error) {
      console.log("error? ", error);
      return error.response.data.message;
    }
  };
  const handlePswdCheck = async (pswd) => {
    try {
      const res = await authApi.post("/validate", { password: pswd });
    } catch (error) {
      return error.response.data.message;
    }
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleSignup,
    onPasswordCheck: handlePswdCheck,
  };

  return (
    <AuthContext.Provider value={{ value }}>{children}</AuthContext.Provider>
  );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);
