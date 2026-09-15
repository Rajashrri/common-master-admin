import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/news`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ===========================
// Add News
// ===========================

export const addNewsApi = async (data: FormData) => {
  return frontApi.post("/add-news", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ===========================
// News List
// ===========================
export const getNewsApi = async (page = 1, limit = 10,search = "") => {
  return frontApi.get( `/list-news?page=${page}&limit=${limit}&search=${search}`);
};
// Single News
// ===========================

export const getNewsByIdApi = async (id: string) => {
  return frontApi.get(`/news-detail/${id}`);
};

// ===========================
// Update News
// ===========================

export const updateNewsApi = async (
  id: string,
  data: FormData
) => {
  return frontApi.put(`/update-news/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ===========================
// Delete News
// ===========================

export const deleteNewsApi = async (id: string) => {
  return frontApi.delete(`/delete-news/${id}`);
};

// ===========================
// Change Status
// ===========================

export const changeNewsStatusApi = async (id: string) => {
  return frontApi.patch(`/change-status/${id}`);
};

// ===========================
// Change Featured
// ===========================

export const changeNewsFeaturedApi = async (id: string) => {
  return frontApi.patch(`/change-featured/${id}`);
};

// ===========================
// SEO
// ===========================

export const getNewsSeoByIdApi = async (id: string) => {
  return frontApi.get(`/news-seo/${id}`);
};

export const updateNewsSeoApi = async (
  id: string,
  data: any
) => {
  return frontApi.put(`/news-updateseo/${id}`, data);
};