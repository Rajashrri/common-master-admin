import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { Pencil, Trash2, Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { hasPermission } from "../../utils/permission";

import {
  addJobCategoryApi,
  getJobCategoriesApi,
  updateJobCategoryApi,
  deleteJobCategoryApi,
  changeJobCategoryStatusApi,
} from "../../api/jobCategoryApi";

interface Category {
  _id: string;
  categoryName: string;
  slug: string;
  status: number;
}

export default function JobCategory() {
  const canAdd = hasPermission("jobcategory", "add");
  const canEdit = hasPermission("jobcategory", "edit");
  const canDelete = hasPermission("jobcategory", "delete");

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const [editId, setEditId] = useState("");

  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    categoryName: "",
    slug: "",
  });
  useEffect(() => {
    fetchCategories(page, search);
  }, [page]);

  // ===========================
  // Category List
  // ===========================

  const fetchCategories = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getJobCategoriesApi(pageNo, 10, searchText);

      if (response.data.success) {
        setCategories(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Auto Slug
  // ===========================

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ===========================
  // Input Change
  // ===========================

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
  };

  // ===========================
  // Validation
  // ===========================

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
  // ===========================
  // Open Add Modal
  // ===========================

  const openAddModal = () => {
    setEditId("");

    setErrors({});

    setFormData({
      categoryName: "",
      slug: "",
    });

    setModalOpen(true);
  };

  // ===========================
  // Open Edit Modal
  // ===========================

  const openEditModal = (item: Category) => {
    setEditId(item._id);

    setErrors({});

    setFormData({
      categoryName: item.categoryName,
      slug: item.slug,
    });

    setModalOpen(true);
  };

  // ===========================
  // Add / Update
  // ===========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      let response;

      if (editId) {
        response = await updateJobCategoryApi(editId, formData);
      } else {
        response = await addJobCategoryApi(formData);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        fetchCategories();

        setModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Delete
  // ===========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Category?",

      text: "You won't be able to recover this!",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#3085d6",

      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteJobCategoryApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ===========================
  // Change Status
  // ===========================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeJobCategoryStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Job Category" />

      <div className="space-y-6">
        <ComponentCard title="Job Category List">
          {/* Header */}

          <div className="mb-5 flex items-end justify-end">
            {canAdd && (
              <button
                onClick={openAddModal}
                className="rounded-lg bg-brand-500 px-5 py-2 text-white hover:bg-brand-600"
              >
                + Add Category
              </button>
            )}
          </div>

          {/* Table */}

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
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
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableCell
                    isHeader
                    className="border px-5 py-3 text-center font-semibold"
                  >
                    #
                  </TableCell>

                  <TableCell
                    isHeader
                    className="border px-5 py-3 text-center font-semibold"
                  >
                    Category Name
                  </TableCell>

                  <TableCell
                    isHeader
                    className="border px-5 py-3 text-center font-semibold"
                  >
                    Slug
                  </TableCell>

                  <TableCell
                    isHeader
                    className="border px-5 py-3 text-center font-semibold"
                  >
                    Status
                  </TableCell>

                  <TableCell
                    isHeader
                    className="border px-5 py-3 text-center font-semibold"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.length > 0 ? (
                  categories.map((item, index) => (
                    <TableRow
                      key={item._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="text-center">{index + 1}</TableCell>

                      <TableCell className="text-center">
                        {item.categoryName}
                      </TableCell>

                      <TableCell className="text-center">{item.slug}</TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={item.status === 1}
                            onChange={() => handleStatus(item._id)}
                          />

                          <div
                            className="peer h-6 w-11 rounded-full bg-gray-300
      after:absolute after:left-[2px] after:top-[2px]
      after:h-5 after:w-5 after:rounded-full
      after:bg-white after:transition-all
      peer-checked:bg-green-600
      peer-checked:after:translate-x-5"
                          ></div>
                        </label>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(item)}
                              className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-gray-500"
                    >
                      No Job Categories Found
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
        </ComponentCard>
      </div>

      {/* Modal */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-semibold">
              {editId ? "Edit Job Category" : "Add Job Category"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Category */}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">
                  Category Name
                  <span className="text-red-500">*</span>
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

              {/* Slug */}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">Slug</label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4"
                />

                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
