import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { ColorRing } from "react-loader-spinner";
import "./Signup.css";

export const Signup = () => {
  const { value } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [signupStatusMessage, setSignupStatusMessage] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [isloading2, setIsLoading2] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleInputChange = (event) => {
    setSignupStatusMessage(null);
    const { name, value } = event.target;
    if (name === "password") {
      setIsPasswordValid(false);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const signup = async () => {
    if (isPasswordValid) {
      setSignupStatusMessage(null);
      setIsLoading(true);
      const mssg = await value.onRegister(formData);
      setIsLoading(false);
      if (mssg) {
        setSignupStatusMessage(mssg);
      }
    }
  };
  const checkpswd = async () => {
    setIsLoading2(true);
    const mssg = await value.onPasswordCheck(formData.password);
    setIsLoading2(false);
    if (mssg) {
      setSignupStatusMessage(mssg);
    }
    setIsPasswordValid(true);
  };
  return (
    <>
      <form className="form-container">
        {signupStatusMessage && (
          <p className="error-box">{signupStatusMessage}</p>
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
        <div className="row">
          <label>
            Password: <span />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <span />
          {isloading2 ? (
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
            <button
              className="text-button"
              type="button"
              style={{
                color: isPasswordValid ? "greenyellow" : "white",
                cursor: isPasswordValid ? "default" : "pointer",
              }}
              onClick={checkpswd}
              disabled={isPasswordValid}
            >
              {isPasswordValid ? "Password Validated" : "Validate Password"}
            </button>
          )}
        </div>
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
          <button
            className="signup-button"
            type="button"
            onClick={signup}
            disabled={!isPasswordValid}
          >
            Register
          </button>
        )}
      </form>
    </>
  );
};
