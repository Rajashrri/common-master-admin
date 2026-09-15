import axios from "axios";

const testimonialApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/testimonial`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export const addTestimonialApi = async (data: any) => {
  return testimonialApi.post("/add-testimonial", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getTestimonialsApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return testimonialApi.get(
    `/list-testimonial?page=${page}&limit=${limit}&search=${search}`
  );
};


export const getTestimonialByIdApi = async (id: string) => {
  return testimonialApi.get(`/testimonial-detail/${id}`);
};

export const updateTestimonialApi = async (id: string, data: any) => {
  return testimonialApi.put(`/update-testimonial/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteTestimonialApi = async (id: string) => {
  return testimonialApi.delete(`/delete-testimonial/${id}`);
};

export const changeTestimonialStatusApi = async (id: string) => {
  return testimonialApi.patch(`/change-status/${id}`);
};