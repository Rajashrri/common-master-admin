import axios from "axios";

const leadershipApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/leadership-team`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});


// ================= ADD =================

export const addLeadershipApi = async (data: any) => {
  return leadershipApi.post("/add", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ================= LIST =================

export const getLeadershipApi = async () => {
  return leadershipApi.get("/list");
};


// ================= DETAIL =================

export const getLeadershipDetailApi = async (
  id: string
) => {
  return leadershipApi.get(`/detail/${id}`);
};


// ================= UPDATE =================

export const updateLeadershipApi = async (
  id: string,
  data: any
) => {
  return leadershipApi.put(`/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ================= DELETE =================

export const deleteLeadershipApi = async (
  id: string
) => {
  return leadershipApi.delete(`/delete/${id}`);
};


// ================= STATUS =================

export const changeLeadershipStatusApi = async (
  id: string
) => {
  return leadershipApi.patch(`/status/${id}`);
};