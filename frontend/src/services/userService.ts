import axios from "axios";

const API_URL = "http://localhost:3331";

export const getUsers = () => axios.get(`${API_URL}/users`);
export const getUserById = (id: string) => axios.get(`${API_URL}/users/${id}`);
export const createUser = (data: any) => axios.post(`${API_URL}/users`, data);
export const updateUser = (id: string, data: any) =>
  axios.put(`${API_URL}/users/${id}`, data);
export const deleteUser = (id: string) =>
  axios.delete(`${API_URL}/users/${id}`);
