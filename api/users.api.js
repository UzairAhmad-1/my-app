import { API } from "./api";
import axios from "axios";

export const createUser = async (data) => {
  try {
    const response = await axios.post("http://10.0.2.2:3000/api/users", data);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Axios error:", error.message);
    throw error; // rethrow or handle as needed
  }
};

export const getUser = (id) => {
  return API.get(`/users/${id}`);
};

export const updateUser = (id, data) => {
  return API.put(`/users/${id}`, data);
};
