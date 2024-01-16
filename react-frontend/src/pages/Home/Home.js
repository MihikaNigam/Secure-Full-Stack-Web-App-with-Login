import { useAuth } from "../../context/AuthProvider";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const { value } = useAuth();

  const nav = (path) => {
    navigate(path);
  };

  return (
    <>
      <h2>Home (Public)</h2>
      {!value.token && (
        <div>
          <button type="button" onClick={() => nav("/home/login")}>
            Sign In
          </button>
          <span />
          <button type="button" onClick={() => nav("/home/signup")}>
            Sign Up
          </button>
        </div>
      )}
    </>
  );
};
