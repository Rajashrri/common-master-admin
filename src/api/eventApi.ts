import axios from "axios";

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/event`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ===========================
// Add Event
// ===========================

export const addEventApi = async (data: FormData) => {
  return frontApi.post("/add-event", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ===========================
// Event List
// ===========================

export const getEventsApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return frontApi.get(
    `/list-event?page=${page}&limit=${limit}&search=${search}`
  );
};

// ===========================
// Single Event
// ===========================

export const getEventByIdApi = async (id: string) => {
  return frontApi.get(`/event-detail/${id}`);
};

// ===========================
// Update Event
// ===========================

export const updateEventApi = async (
  id: string,
  data: FormData
) => {
  return frontApi.put(`/update-event/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ===========================
// Delete Event
// ===========================

export const deleteEventApi = async (id: string) => {
  return frontApi.delete(`/delete-event/${id}`);
};

// ===========================
// Change Status
// ===========================

export const changeEventStatusApi = async (id: string) => {
  return frontApi.patch(`/change-status/${id}`);
};

// ===========================
// Change Featured
// ===========================

export const changeEventFeaturedApi = async (
  id: string
) => {
  return frontApi.patch(`/change-featured/${id}`);
};

// ===========================
// SEO
// ===========================

export const getEventSeoByIdApi = async (
  id: string
) => {
  return frontApi.get(`/event-seo/${id}`);
};

export const updateEventSeoApi = async (
  id: string,
  data: any
) => {
  return frontApi.put(
    `/event-updateseo/${id}`,
    data
  );
};