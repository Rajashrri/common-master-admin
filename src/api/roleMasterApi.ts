import axios from "axios";

const roleApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/role-master`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ================= ADD =================

export const addRoleApi = async (data: any) => {
  return roleApi.post("/add-role", data);
};

// ================= LIST =================

export const getRolesApi = async () => {
  return roleApi.get("/list-role");
};

// ================= DETAIL =================

export const getRoleDetailApi = async (id: string) => {
  return roleApi.get(`/role-detail/${id}`);
};

// ================= UPDATE =================

export const updateRoleApi = async (
  id: string,
  data: any
) => {
  return roleApi.put(`/update-role/${id}`, data);
};

// ================= DELETE =================

export const deleteRoleApi = async (id: string) => {
  return roleApi.delete(`/delete-role/${id}`);
};

// ================= STATUS =================

export const changeRoleStatusApi = async (id: string) => {
  return roleApi.patch(`/change-status/${id}`);
};