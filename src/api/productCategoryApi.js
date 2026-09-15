import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/product-category`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const createProductCategoryApi = (data) =>
  api.post("/", data);

export const getProductCategoriesApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return api.get(
    `/?page=${page}&limit=${limit}&search=${search}`
  );
};
export const getProductCategoryByIdApi = (id) =>
  api.get(`/${id}`);

export const updateProductCategoryApi = (id, data) =>
  api.put(`/${id}`, data);

export const deleteProductCategoryApi = (id) =>
  api.delete(`/${id}`);

export const toggleProductCategoryStatusApi = (id) =>
  api.patch(`/${id}/status`);