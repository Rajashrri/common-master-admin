import axios from "axios";

const articleApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/articles`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ================= ADD =================
export const addArticleApi = async (data: any) => {
  return articleApi.post("/add-article", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= LIST =================
export const getArticlesApi = async () => {
  return articleApi.get("/list-articles");
};

// ================= DETAIL =================
export const getArticleByIdApi = async (id: string) => {
  return articleApi.get(`/article-detail/${id}`);
};

// ================= UPDATE =================
export const updateArticleApi = async (
  id: string,
  data: any
) => {
  return articleApi.put(
    `/update-article/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ================= DELETE =================
export const deleteArticleApi = async (id: string) => {
  return articleApi.delete(`/delete-article/${id}`);
};

// ================= STATUS =================
export const changeArticleStatusApi = async (id: string) => {
  return articleApi.patch(`/change-status/${id}`);
};