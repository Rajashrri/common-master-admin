import axios from "axios";

const galleryApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/gallery`,
});

// ==========================
// Add Gallery
// ==========================
export const addGalleryApi = (data: FormData) =>
  galleryApi.post("/add-gallery", data);

// ==========================
// Gallery List
// ==========================
export const getGalleryApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return galleryApi.get(
    `/list-gallery?page=${page}&limit=${limit}&search=${search}`
  );
};

// ==========================
// Gallery Detail
// ==========================
export const getGalleryDetailApi = (id: string) =>
  galleryApi.get(`/gallery-detail/${id}`);

// ==========================
// Update Gallery
// ==========================
export const updateGalleryApi = (
  id: string,
  data: FormData
) => galleryApi.put(`/update-gallery/${id}`, data);

// ==========================
// Delete Gallery
// ==========================
export const deleteGalleryApi = (id: string) =>
  galleryApi.delete(`/delete-gallery/${id}`);

// ==========================
// Change Status
// ==========================
export const changeGalleryStatusApi = (id: string) =>
  galleryApi.patch(`/change-status/${id}`);