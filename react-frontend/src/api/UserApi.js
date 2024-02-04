import axios from "axios";

const UserApi = axios.create({
  baseURL: "https://localhost:8000/api",
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
    console.log("error? ", error);
    return error.response?.data ? error.response.data.message : error.message;
  }
};

export default UserApi;
