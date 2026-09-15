import axios from "axios";

const videoCategoryApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/video-category`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ==========================
// Add Category
// ==========================

export const addCategoryApi = (data: {
  categoryName: string;
  slug: string;
}) => {
  return videoCategoryApi.post("/add-category", data);
};

// ==========================
// Get Category List
// ==========================

export const getCategoriesApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return videoCategoryApi.get(
    `/list?page=${page}&limit=${limit}&search=${search}`
  );
};
// ==========================
// Get Category Detail
// ==========================

export const getCategoryByIdApi = (id: string) => {
  return videoCategoryApi.get(`/${id}`);
};

// ==========================
// Update Category
// ==========================

export const updateCategoryApi = (
  id: string,
  data: {
    categoryName: string;
    slug: string;
  }
) => {
  return videoCategoryApi.put(`/update/${id}`, data);
};

// ==========================
// Delete Category
// ==========================

export const deleteCategoryApi = (id: string) => {
  return videoCategoryApi.delete(`/delete/${id}`);
};

// ==========================
// Change Status
// ==========================

export const changeCategoryStatusApi = (id: string) => {
  return videoCategoryApi.patch(`/change-status/${id}`);
};