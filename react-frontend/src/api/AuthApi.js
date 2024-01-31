import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default authApi;
