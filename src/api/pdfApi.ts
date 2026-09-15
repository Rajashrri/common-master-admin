import axios from "axios";

const pdfApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/pdf`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ==========================
// List
// ==========================

export const getPdfsApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return pdfApi.get(
    `/list?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
};

// ==========================
// Single
// ==========================

export const getPdfByIdApi = async (id: string) => {
  return pdfApi.get(`/${id}`);
};

// ==========================
// Add
// ==========================

export const addPdfApi = async (data: FormData) => {
  return pdfApi.post("/add-pdf", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==========================
// Update
// ==========================

export const updatePdfApi = async (
  id: string,
  data: FormData
) => {
  return pdfApi.put(
    `/update/${id}`,
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};

// ==========================
// Delete
// ==========================

export const deletePdfApi = async (
  id: string
) => {
  return pdfApi.delete(
    `/delete/${id}`
  );
};

// ==========================
// Status
// ==========================

export const changePdfStatusApi =
  async (id: string) => {
    return pdfApi.patch(
      `/change-status/${id}`
    );
  };