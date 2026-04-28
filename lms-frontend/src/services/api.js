import axios from "axios";

const API = axios.create({
  baseURL: "https://lms-smart-planner-backend.onrender.com",
});

export default API;