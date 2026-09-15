import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/job-category`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ==========================
// Add Category
// ==========================

export const addJobCategoryApi = async (
  data: any
) => {
  return frontApi.post(
    "/add-category",
    data
  );
};

// ==========================
// Category List
// ==========================

export const getJobCategoriesApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return frontApi.get(
    `/list?page=${page}&limit=${limit}&search=${search}`
  );
};
// ==========================
// Single Category
// ==========================

export const getJobCategoryByIdApi =
  async (id: string) => {
    return frontApi.get(`/${id}`);
  };

// ==========================
// Update Category
// ==========================

export const updateJobCategoryApi =
  async (
    id: string,
    data: any
  ) => {
    return frontApi.put(
      `/update/${id}`,
      data
    );
  };

// ==========================
// Delete Category
// ==========================

export const deleteJobCategoryApi =
  async (id: string) => {
    return frontApi.delete(
      `/delete/${id}`
    );
  };

// ==========================
// Change Status
// ==========================

export const changeJobCategoryStatusApi =
  async (id: string) => {
    return frontApi.patch(
      `/change-status/${id}`
    );
  };