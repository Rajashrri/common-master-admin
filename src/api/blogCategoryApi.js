import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/blog-category`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Add Category
export const addCategoryApi = async (data) => {
  return frontApi.post("/add-category", data);
};

// Category List
export const getCategoriesApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return frontApi.get(
    `/list?page=${page}&limit=${limit}&search=${search}`
  );
};
// Single Category
export const getCategoryByIdApi = async (id) => {
  return frontApi.get(`/${id}`);
};

// Update Category
export const updateCategoryApi = async (id, data) => {
  return frontApi.put(`/update/${id}`, data);
};

// Delete Category
export const deleteCategoryApi = async (id) => {
  return frontApi.delete(`/delete/${id}`);
};

export const changeCategoryStatusApi = async (id) => {
  return frontApi.patch(
    `/change-status/${id}`
  );
};