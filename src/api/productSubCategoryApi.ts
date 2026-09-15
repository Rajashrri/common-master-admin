import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/product-subcategory`,
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

export const createProductSubCategoryApi = (data) =>
  api.post("/", data);

export const getProductSubCategoriesApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return api.get(
    `/?page=${page}&limit=${limit}&search=${search}`
  );
};

export const getProductSubCategoryByIdApi = (id) =>
  api.get(`/${id}`);

export const updateProductSubCategoryApi = (id, data) =>
  api.put(`/${id}`, data);

export const deleteProductSubCategoryApi = (id) =>
  api.delete(`/${id}`);

export const toggleProductSubCategoryStatusApi = (id) =>
  api.patch(`/${id}/status`);