import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { ColorRing } from "react-loader-spinner";
import "./Login.css";

export const Login = () => {
  const { value } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginStatusMessage, setLoginStatusMessage] = useState(null);
  const [isloading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setLoginStatusMessage(null);
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const login = async () => {
    setLoginStatusMessage(null);
    setIsLoading(true);
    const mssg = await value.onLogin(formData);
    setIsLoading(false);
    if (mssg) {
      setLoginStatusMessage(mssg);
    }
  };

  return (
    <>
      <form className="form-container">
        {loginStatusMessage && (
          <p className="error-box">{loginStatusMessage}</p>
        )}
        <label>
          Username:
          <span />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password: <span />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {isloading ? (
          <ColorRing
            visible={true}
            height="100"
            width="100"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        ) : (
          <button className="login-button" type="button" onClick={login}>
            Login
          </button>
        )}
      </form>
    </>
  );
};
