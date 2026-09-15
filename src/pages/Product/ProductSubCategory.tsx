import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  createProductSubCategoryApi,
  getProductSubCategoriesApi,
  updateProductSubCategoryApi,
  deleteProductSubCategoryApi,
  toggleProductSubCategoryStatusApi,
} from "../../api/productSubCategoryApi";

import { getProductCategoriesApi } from "../../api/productCategoryApi";
import { hasPermission } from "../../utils/permission";

interface Category {
  _id: string;
  name: string;
}

interface ProductSubCategory {
  _id: string;
  category: Category;
  name: string;
  slug: string;
  status: number;
}

export default function ProductSubCategory() {
  // ==========================

  const canAdd = hasPermission("productsubcategory", "add");
  const canEdit = hasPermission("productsubcategory", "edit");
  const canDelete = hasPermission("productsubcategory", "delete");

  // States
  // ==========================

  const [subCategories, setSubCategories] = useState<ProductSubCategory[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [editId, setEditId] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    slug: "",
  });

  const [errors, setErrors] = useState({
    category: "",
    name: "",
  });

  // ==========================
  // Load Data
  // ==========================

  useEffect(() => {
    fetchSubCategories(page, search);
    fetchCategories();
  }, [page]);

  // ==========================
  // Get All Categories
  // ==========================

  const fetchCategories = async () => {
    try {
      const response = await getProductCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load Product Categories");
    }
  };

  // ==========================
  // Get All Sub Categories
  // ==========================

  const fetchSubCategories = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getProductSubCategoriesApi(pageNo, 10, searchText);

      if (response.data.success) {
        setSubCategories(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Open Add Modal
  // ==========================

  const openAddModal = () => {
    setIsEdit(false);

    setEditId("");

    setFormData({
      category: "",
      name: "",
      slug: "",
    });

    setErrors({
      category: "",
      name: "",
    });

    setIsOpen(true);
  };

  // ==========================
  // Open Edit Modal
  // ==========================

  const openEditModal = (item: ProductSubCategory) => {
    setIsEdit(true);

    setEditId(item._id);

    setFormData({
      category: item.category?._id,
      name: item.name,
      slug: item.slug,
    });

    setErrors({
      category: "",
      name: "",
    });

    setIsOpen(true);
  };

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      }));

      setErrors((prev) => ({
        ...prev,
        name: "",
      }));
    } else if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
      }));

      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  // ==========================
  // Submit Form
  // ==========================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.category) {
      setErrors((prev) => ({
        ...prev,
        category: "Product Category is required",
      }));
      return;
    }

    if (!formData.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: "Sub Category Name is required",
      }));
      return;
    }

    try {
      let response;

      if (isEdit) {
        response = await updateProductSubCategoryApi(editId, formData);
      } else {
        response = await createProductSubCategoryApi(formData);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        fetchSubCategories();

        setIsOpen(false);

        setFormData({
          category: "",
          name: "",
          slug: "",
        });

        setErrors({
          category: "",
          name: "",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ==========================
  // Change Status
  // ==========================

  const handleStatus = async (id: string) => {
    try {
      const response = await toggleProductSubCategoryStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchSubCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  // ==========================
  // Delete Sub Category
  // ==========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteProductSubCategoryApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchSubCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ==========================
  // Return
  // ==========================

  return (
    <>
      <PageBreadcrumb pageTitle="Product Sub Category" />

      <div className="space-y-6">
        <ComponentCard title="Product Sub Category">
          {/* Header */}
          <div className="mb-5 flex items-center justify-end">
            {canAdd && (
              <button
                onClick={openAddModal}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Sub Category
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Categories ({subCategories.length})
                </h3>

                <div className="relative w-full max-w-md">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search....."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                      fetchSubCategories(1, e.target.value);
                    }}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-center font-medium"
                    >
                      Sr No
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 font-medium">
                      Product Category
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 font-medium">
                      Sub Category
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 font-medium">
                      Slug
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-center font-medium"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-center font-medium"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : subCategories.length > 0 ? (
                    subCategories.map((item, index) => (
                      <TableRow key={item._id}>
                        {/* Sr No */}
                        <TableCell className="px-5 py-4 text-center">
                          {index + 1}
                        </TableCell>

                        {/* Product Category */}
                        <TableCell className="px-5 py-4">
                          {item.category?.name}
                        </TableCell>

                        {/* Sub Category */}
                        <TableCell className="px-5 py-4">{item.name}</TableCell>

                        {/* Slug */}
                        <TableCell className="px-5 py-4">{item.slug}</TableCell>

                        {/* Status */}
                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleStatus(item._id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                              item.status === 1 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                                item.status === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />

                            <span
                              className={`absolute text-[9px] font-bold ${
                                item.status === 1
                                  ? "left-1 text-white"
                                  : "right-1 text-gray-700"
                              }`}
                            >
                              {item.status === 1 ? "ON" : "OFF"}
                            </span>
                          </button>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {canEdit && (
                              <button
                                onClick={() => openEditModal(item)}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
                                title="Edit"
                              >
                                <Pencil size={16} strokeWidth={2} />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white"
                                title="Delete"
                              >
                                <Trash2 size={16} strokeWidth={2} />
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        No Product Sub Category Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-8 px-6 py-5 flex items-center justify-between border-t border-gray-200 bg-white">
                <p className="text-sm text-gray-600">
                  Page <span className="font-semibold">{page}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  {/* Previous */}
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index + 1)}
                      className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
                        page === index + 1
                          ? "bg-brand-500 text-white"
                          : "border border-gray-300 bg-white hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Add / Edit Modal */}
          {isOpen && (
            <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-lg rounded-xl bg-white shadow-lg dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                  <h3 className="text-lg font-semibold">
                    {isEdit
                      ? "Edit Product Sub Category"
                      : "Add Product Sub Category"}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5 p-6">
                    {/* Product Category */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Product Category
                      </label>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Product Category</option>

                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>

                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Sub Category Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Sub Category Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Sub Category Name"
                        className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      />

                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Slug
                      </label>

                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="Slug"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-5 py-2 text-white hover:bg-brand-600"
                    >
                      {isEdit ? "Update Sub Category" : "Add Sub Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
