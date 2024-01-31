import axios from "axios";

const UserApi = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const fetchAllUsers = async () => {
  try {
    const response = await UserApi.get("/users");
    const users = response.data;
    console.log("My userss: ", users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export default UserApi;
