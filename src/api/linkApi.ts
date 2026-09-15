import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/link`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ============================
// Add Link
// ============================

export const addLinkApi = async (data: {
  linkName: string;
  link: string;
}) => {
  return frontApi.post("/add-link", data);
};

// ============================
// List
// ============================
export const getLinksApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return frontApi.get(
    `/list?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
};

// ============================
// Single Link
// ============================

export const getLinkByIdApi = async (id: string) => {
  return frontApi.get(`/${id}`);
};

// ============================
// Update
// ============================

export const updateLinkApi = async (
  id: string,
  data: {
    linkName: string;
    link: string;
  }
) => {
  return frontApi.put(`/update/${id}`, data);
};

// ============================
// Delete
// ============================

export const deleteLinkApi = async (id: string) => {
  return frontApi.delete(`/delete/${id}`);
};

// ============================
// Status
// ============================

export const changeLinkStatusApi = async (
  id: string
) => {
  return frontApi.patch(
    `/change-status/${id}`
  );
};