import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/AuthApi";
import cookie from "react-cookies";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const handleLogin = async (formdata) => {
    try {
      const res = await authApi.post("/signin", formdata);
      if (res.status === 200) {
        const mycookie = res.data.cookie;
        cookie.save("auth-session", mycookie, { path: "/" });
        cookie.save("user", formdata.username, { path: "/" });
        navigate("/landing");
      }
    } catch (error) {
      console.log("error? ", error);
      return error.response.data.message;
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.post("/signout");
      cookie.remove("auth-session", { path: "/" });
      cookie.remove("user", { path: "/" });
      navigate("/home");
    } catch (error) {
      console.log("error? ", error);
      return error.response.data.message;
    }
  };

  const handleSignup = async (formdata) => {
    try {
      const res = await authApi.post("/signup", formdata);
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
