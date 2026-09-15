import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
  timeout: 300000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getProfile = async () => {
  const { data } = await API.get("/getprofile");
  return data;
};
export const updateProfile = async (profileData) => {
  const formData = new FormData();

  formData.append("name", profileData.name);
  formData.append("phone", profileData.phone);
  formData.append("email", profileData.email);

  if (profileData.pic) {
    formData.append("pic", profileData.pic);
  }

  const { data } = await API.put("/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updatePassword = async (passwordData) => {
  const { data } = await API.put("/password", passwordData);

  return data;
};
export const updateWebsiteSettingApi = async (formData) => {
  const { data } = await API.put("/website-setting", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getWebsiteSettingApi = async () => {
  const { data } = await API.get("/website-setting");
  return data;
};
