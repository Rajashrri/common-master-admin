import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { Pencil, Trash2, Plus, Search, X } from "lucide-react";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { hasPermission } from "../../utils/permission";

import {
  addCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
  deleteCategoryApi,
  changeCategoryStatusApi,
} from "../../api/faqCategoryApi";

interface Category {
  _id: string;
  categoryName: string;
  slug: string;
  status: number;
}

export default function FaqCategory() {
  const canAdd = hasPermission("faqcategory", "add");
  const canEdit = hasPermission("faqcategory", "edit");
  const canDelete = hasPermission("faqcategory", "delete");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const [editingId, setEditingId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    categoryName: "",
    slug: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchCategories(page, search);
  }, [page]);

  // ==========================
  // Fetch Categories
  // ==========================

  const fetchCategories = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getCategoriesApi(pageNo, 10, searchText);

      if (response.data.success) {
        setCategories(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch {
      toast.error("Unable to load FAQ Categories");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Slug
  // ==========================

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoryName"
        ? {
            slug: slugify(value),
          }
        : {}),
    }));

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // ==========================
  // Search
  // ==========================

  const filteredCategories = categories.filter((item) =>
    item.categoryName.toLowerCase().includes(search.toLowerCase()),
  );
  // ==========================
  // Validation
  // ==========================

  const validate = () => {
    let err: any = {};

    if (!formData.categoryName.trim()) {
      err.categoryName = "Category Name is required";
    }

    if (!formData.slug.trim()) {
      err.slug = "Slug is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ==========================
  // Open Add Modal
  // ==========================

  const handleAdd = () => {
    setEditingId("");

    setFormData({
      categoryName: "",
      slug: "",
    });

    setErrors({});

    setOpenModal(true);
  };

  // ==========================
  // Open Edit Modal
  // ==========================

  const handleEdit = (item: Category) => {
    setEditingId(item._id);

    setFormData({
      categoryName: item.categoryName,
      slug: item.slug,
    });

    setErrors({});

    setOpenModal(true);
  };

  // ==========================
  // Add / Update
  // ==========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let response;

      if (editingId) {
        response = await updateCategoryApi(editingId, formData);
      } else {
        response = await addCategoryApi(formData);
      }

      toast.success(response.data.message);

      fetchCategories();

      setOpenModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Category?",

      text: "You won't be able to recover this category!",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, Delete",

      cancelButtonText: "Cancel",

      reverseButtons: true,

      confirmButtonColor: "#dc2626",

      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteCategoryApi(id);

      Swal.fire({
        icon: "success",

        title: "Deleted!",

        text: response.data.message,

        timer: 1500,

        showConfirmButton: false,
      });

      fetchCategories();
    } catch (error: any) {
      Swal.fire({
        icon: "error",

        title: "Error",

        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  // ==========================
  // Status Change
  // ==========================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeCategoryStatusApi(id);

      toast.success(response.data.message);

      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="FAQ Category" />

      <div className="space-y-6">
        <ComponentCard title="FAQ Category">
          {/* Header */}

          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            {canAdd && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-white hover:bg-brand-600"
              >
                <Plus size={18} />
                Add FAQ Category
              </button>
            )}
          </div>

          {/* Table */}

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Categories ({categories.length})
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
                    fetchCategories(1, e.target.value);
                  }}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-center w-20">Sr No</th>

                  <th className="border-b px-4 py-3 text-left">Category</th>

                  <th className="border-b px-4 py-3 text-left">Slug</th>

                  <th className="border-b px-4 py-3 text-center">Status</th>

                  <th className="border-b px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((item, index) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-center">{index + 1}</td>

                      <td className="px-4 py-3 font-medium">
                        {item.categoryName}
                      </td>

                      <td className="px-4 py-3">{item.slug}</td>

                      <td className="px-4 py-3 text-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={item.status === 1}
                            onChange={() => handleStatus(item._id)}
                            className="peer sr-only"
                          />

                          <div className="peer h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-green-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5"></div>
                        </label>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {canEdit && (
                            <button
                              title="Edit"
                              onClick={() => handleEdit(item)}
                              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              title="Delete"
                              onClick={() => handleDelete(item._id)}
                              className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      No FAQ Categories Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        </ComponentCard>

        {/* Modal */}

        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-5">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit FAQ Category" : "Add FAQ Category"}
                </h2>

                <button onClick={() => setOpenModal(false)}>
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category Name
                  </label>

                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 px-4"
                  />

                  {errors.categoryName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.categoryName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Slug</label>

                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 px-4"
                  />

                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t pt-5">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="rounded-lg border border-gray-300 px-5 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-brand-500 px-5 py-2 text-white"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingId
                        ? "Update Category"
                        : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
