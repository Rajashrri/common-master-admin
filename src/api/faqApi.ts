import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/faq`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ==========================
// Add FAQ
// ==========================

export const addFaqApi = async (data: any) => {
  return frontApi.post("/add-faq", data);
};

// ==========================
// FAQ List
// ==========================

export const getFaqsApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return frontApi.get(
    `/list-faq?page=${page}&limit=${limit}&search=${search}`
  );
};

// ==========================
// Single FAQ
// ==========================

export const getFaqByIdApi = async (
  id: string
) => {
  return frontApi.get(`/faq-detail/${id}`);
};

// ==========================
// Update FAQ
// ==========================

export const updateFaqApi = async (
  id: string,
  data: any
) => {
  return frontApi.put(
    `/update-faq/${id}`,
    data
  );
};

// ==========================
// Delete FAQ
// ==========================

export const deleteFaqApi = async (
  id: string
) => {
  return frontApi.delete(
    `/delete-faq/${id}`
  );
};

// ==========================
// Change Status
// ==========================

export const changeFaqStatusApi = async (
  id: string
) => {
  return frontApi.patch(
    `/change-status/${id}`
  );
};

// ==========================
// Get SEO
// ==========================

export const getSeoByIdApi = async (
  id: string
) => {
  return frontApi.get(
    `/faq-seo/${id}`
  );
};

// ==========================
// Update SEO
// ==========================

export const updateSeoApi = async (
  id: string,
  data: any
) => {
  return frontApi.put(
    `/faq-updateseo/${id}`,
    data
  );
};