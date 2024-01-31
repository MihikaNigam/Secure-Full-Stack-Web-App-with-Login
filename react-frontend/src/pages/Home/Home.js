import React from "react";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";

export const Home = () => {
  const navigate = useNavigate();
  const session = cookie.load("auth-session");

  const nav = (path) => {
    navigate(path);
  };

  return (
    <>
      <h2>Home (Public)</h2>
      {!session && (
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
