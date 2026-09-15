import axios from "axios";

const clienteleApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/clientele`,
});

export const addClientApi = (data: FormData) =>
  clienteleApi.post("/add-client", data);
export const getClientApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return clienteleApi.get(
    `/list-client?page=${page}&limit=${limit}&search=${search}`
  );
};

export const getClientDetailApi = (id: string) =>
  clienteleApi.get(`/client-detail/${id}`);

export const updateClientApi = (id: string, data: FormData) =>
  clienteleApi.put(`/update-client/${id}`, data);

export const deleteClientApi = (id: string) =>
  clienteleApi.delete(`/delete-client/${id}`);

export const changeStatusApi = (id: string) =>
  clienteleApi.patch(`/change-status/${id}`);