import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/service`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// ==========================
// Add Service
// ==========================

export const addServiceApi = (data: FormData) =>
  api.post("/add-service", data);

// ==========================
// Service List
// ==========================

export const getServicesApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return api.get(
    `/list-service?page=${page}&limit=${limit}&search=${search}`
  );
};

// ==========================
// Get Service By Id
// ==========================

export const getServiceByIdApi = (id: string) =>
  api.get(`/service-detail/${id}`);

// ==========================
// Update Service
// ==========================

export const updateServiceApi = (
  id: string,
  data: FormData
) => api.put(`/update-service/${id}`, data);

// ==========================
// Delete Service
// ==========================

export const deleteServiceApi = (id: string) =>
  api.delete(`/delete-service/${id}`);

// ==========================
// Change Status
// ==========================

export const changeServiceStatusApi = (id: string) =>
  api.patch(`/change-status/${id}`);

// ==========================
// Change Featured
// ==========================

export const changeServiceFeaturedApi = (id: string) =>
  api.patch(`/change-featured/${id}`);


export const getServiceSeoByIdApi = (id: string) =>
  api.get(`/service-seo/${id}`);

export const updateServiceSeoApi = (
  id: string,
  data: any
) =>
  api.put(
    `/service-updateseo/${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );