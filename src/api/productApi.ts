import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/product`,

});

// Add Product
export const addProductApi = (data: FormData) =>
  api.post("/add-product", data);

// Product List
export const getProductsApi = (
  page = 1,
  limit = 10,
  search = ""
) => {
  return api.get(
    `/list-product?page=${page}&limit=${limit}&search=${search}`
  );
};

// Product Detail
export const getProductByIdApi = (id: string) =>
  api.get(`/product-detail/${id}`);

// Update Product
export const updateProductApi = (
  id: string,
  data: FormData
) => api.put(`/update-product/${id}`, data);

// Delete Product
export const deleteProductApi = (id: string) =>
  api.delete(`/delete-product/${id}`);

// Change Status
export const changeProductStatusApi = (id: string) =>
  api.patch(`/change-status/${id}`);

// Change Featured
export const changeFeaturedApi = (id: string) =>
  api.patch(`/change-featured/${id}`);



export const getProductSeoByIdApi = (id: string) =>
  api.get(`/product-seo/${id}`);

export const updateProductSeoApi = (
  id: string,
  data: any
) => api.put(`/product-updateseo/${id}`, data);