import axios from "axios";

const userApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/user`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// =======================
// ADD USER
// =======================

export const addUserApi = async (data: any) => {
  return await userApi.post("/add", data);
};

// =======================
// USER LIST
// =======================

export const getUserListApi = async () => {
  return await userApi.get("/list");
};

// =======================
// USER DETAIL
// =======================

export const getUserDetailApi = async (id: string) => {
  return await userApi.get(`/detail/${id}`);
};

// =======================
// UPDATE USER
// =======================

export const updateUserApi = async (id: string, data: any) => {
  return await userApi.put(`/update/${id}`, data);
};

// =======================
// DELETE USER
// =======================

export const deleteUserApi = async (id: string) => {
  return await userApi.delete(`/delete/${id}`);
};

// =======================
// CHANGE STATUS
// =======================

export const changeUserStatusApi = async (id: string) => {
  return await userApi.patch(`/status/${id}`);
};

export default userApi;