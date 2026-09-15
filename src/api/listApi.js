import axios from "axios";

// =====================================
// FRONTEND PUBLIC API CLIENT
// File: src/utils/frontApi.js
// =====================================

const frontApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/list`,

  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// =====================================
// RESPONSE INTERCEPTOR
// =====================================

frontApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("❌ Network Error:", error.message);
      error.message = "Network error. Please check internet connection.";
    }

    if (error.response?.status === 404) {
      console.error("❌ API Not Found");
    }

    if (error.response?.status === 500) {
      console.error("❌ Server Error");
    }

    return Promise.reject(error);
  },
);


export const getBlogsApi = () => {
  return frontApi.get("/blogs");
};

export const getBlogCategoriesApi = () => {
  return frontApi.get("/blog-categories");
};

export const getBlogDetailsApi = (slug) => {
  return frontApi.get(`/blog/${slug}`);
};


export const getNewsletterApi = () => {
  return frontApi.get("/newsletter");
};
export const contactApi = (data) => {
  return frontApi.post(
    `/add-contact`,
    data
  );
};


export const getContactsApi = () => {
  return frontApi.get(`/contacts`);
};

export const getCareersApi = () => {
  return frontApi.get(`/careers`);
};