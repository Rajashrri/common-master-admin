import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/project`,
  timeout: 300000,
});

// ================= Add =================

export const addProjectApi = async (data: FormData) => {
  return frontApi.post("/add-project", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= List =================

export const getProjectsApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return frontApi.get(
    `/list-project?page=${page}&limit=${limit}&search=${search}`
  );
};
// ================= Single =================

export const getProjectByIdApi = async (id: string) => {
  return frontApi.get(`/project-detail/${id}`);
};

// ================= Update =================

export const updateProjectApi = async (
  id: string,
  data: FormData
) => {
  return frontApi.put(`/update-project/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= Delete =================

export const deleteProjectApi = async (id: string) => {
  return frontApi.delete(`/delete-project/${id}`);
};

// ================= Status =================

export const changeProjectStatusApi = async (
  id: string
) => {
  return frontApi.patch(`/change-status/${id}`);
};

// ================= Featured =================

export const changeProjectFeaturedApi = async (
  id: string
) => {
  return frontApi.patch(`/change-featured/${id}`);
};

// ================= SEO Detail =================

export const getProjectSeoApi = async (
  id: string
) => {
  return frontApi.get(`/project-seo/${id}`);
};

// ================= SEO Update =================

export const updateProjectSeoApi = async (
  id: string,
  data: any
) => {
  return frontApi.put(`/project-updateseo/${id}`, data);
};