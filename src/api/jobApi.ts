import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/job`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ===========================
// Job Category List
// ===========================

export const getJobCategoriesApi = async () => {
  return frontApi.get("/list");
};

// ===========================
// Add Job
// ===========================

export const addJobApi = async (data: FormData) => {
  return frontApi.post("/add-job", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ===========================
// Job List
// ===========================

export const getJobsApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return frontApi.get(
    `/list-job?page=${page}&limit=${limit}&search=${search}`
  );
};

// ===========================
// Single Job
// ===========================

export const getJobByIdApi = async (id: string) => {
  return frontApi.get(`/job-detail/${id}`);
};

// ===========================
// Update Job
// ===========================

export const updateJobApi = async (
  id: string,
  data: FormData
) => {
  return frontApi.put(`/update-job/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ===========================
// Delete Job
// ===========================

export const deleteJobApi = async (id: string) => {
  return frontApi.delete(`/delete-job/${id}`);
};

// ===========================
// Change Status
// ===========================

export const changeJobStatusApi = async (id: string) => {
  return frontApi.patch(`/change-status/${id}`);
};

// ===========================
// Change Featured
// ===========================

export const changeFeaturedApi = async (id: string) => {
  return frontApi.patch(`/change-featured/${id}`);
};

// ===========================
// SEO
// ===========================

export const getJobSeoByIdApi = async (id: string) => {
  return frontApi.get(`/job-seo/${id}`);
};

export const updateJobSeoApi = async (
  id: string,
  data: any
) => {
  return frontApi.put(`/job-updateseo/${id}`, data);
};