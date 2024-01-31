import React, { useEffect, useState } from "react";
import cookie from "react-cookies";
import { ColorRing } from "react-loader-spinner";
import { fetchAllUsers } from "../../api/UserApi";
import "./Landing.css";

export const Landing = () => {
  const user = cookie.load("user");
  const [isloading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setIsLoading(true);
    const us = await fetchAllUsers();
    setUsers(
      us.data &&
        us.data.map((i) => {
          return i.username;
        })
    );
    setIsLoading(false);
  };

  return (
    <>
      <h2>Landing (Protected)</h2>
      <ul> Authenticated as {user}</ul>
      <div />
      <div />
      <div className="userlist">
        <h3>List of users :</h3>
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
          <UserList users={users} />
        )}
      </div>
    </>
  );
};

export const UserList = ({ users }) => {
  console.log("users : ", users);
  return (
    <ul>
      {users?.length === 0
        ? "No Users To Display"
        : !users
        ? "Couldn't fetch users...."
        : users.map((user, i) => {
            return <li key={i}>{user}</li>;
          })}
    </ul>
  );
};
