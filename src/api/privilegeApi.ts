import axios from "axios";

const privilegeApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/privilege`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const savePrivilegeApi = (data: any) =>
  privilegeApi.post("/save", data);

export const getPrivilegeDetailApi = (roleId: string) =>
  privilegeApi.get(`/detail/${roleId}`);

export const getPrivilegeListApi = () =>
  privilegeApi.get("/list");

export const deletePrivilegeApi = (id: string) =>
  privilegeApi.delete(`/delete/${id}`);

export const getMyPermissionsApi = () => {
  const token = localStorage.getItem("accessToken");

  return privilegeApi.get("/my-permissions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};