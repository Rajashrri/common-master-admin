import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/service-category`,
});

// ================= Add =================

export const addServiceCategoryApi = (data: any) =>
  api.post("/add-service-category", data);

// ================= List =================

export const getServiceCategoriesApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return api.get(
    `/list-service-category?page=${page}&limit=${limit}&search=${search}`
  );
};

// ================= Detail =================

export const getServiceCategoryByIdApi = (id: string) =>
  api.get(`/service-category-detail/${id}`);

// ================= Update =================

export const updateServiceCategoryApi = (
  id: string,
  data: any
) => api.put(`/update-service-category/${id}`, data);

// ================= Delete =================

export const deleteServiceCategoryApi = (id: string) =>
  api.delete(`/delete-service-category/${id}`);

// ================= Status =================

export const changeServiceCategoryStatusApi = (
  id: string
) => api.patch(`/change-status/${id}`);