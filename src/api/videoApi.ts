import axios from "axios";

const videoApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/video`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

/* ==========================
   Add Video
========================== */

export const addVideoApi = async (data: FormData) => {
  return videoApi.post("/add-video", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ==========================
   List Videos
========================== */
export const getVideosApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return videoApi.get(
    `/list-video?page=${page}&limit=${limit}&search=${search}`
  );
};

/* ==========================
   Video Detail
========================== */

export const getVideoByIdApi = async (id: string) => {
  return videoApi.get(`/video-detail/${id}`);
};

/* ==========================
   Update Video
========================== */

export const updateVideoApi = async (
  id: string,
  data: FormData
) => {
  return videoApi.put(`/update-video/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ==========================
   Delete Video
========================== */

export const deleteVideoApi = async (id: string) => {
  return videoApi.delete(`/delete-video/${id}`);
};

/* ==========================
   Change Status
========================== */

export const changeVideoStatusApi = async (id: string) => {
  return videoApi.patch(`/change-status/${id}`);
};

/* ==========================
   Change Featured
========================== */

export const changeFeaturedApi = async (id: string) => {
  return videoApi.patch(`/change-featured/${id}`);
};

/* ==========================
   SEO
========================== */

export const getSeoByIdApi = async (id: string) => {
  return videoApi.get(`/video-seo/${id}`);
};

export const updateSeoApi = async (
  id: string,
  data: any
) => {
  return videoApi.put(`/video-updateseo/${id}`, data);
};