import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Pencil, Trash2, Search } from "lucide-react";
import { hasPermission } from "../../utils/permission";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  addCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
  deleteCategoryApi,
  changeCategoryStatusApi,
} from "../../api/videoCategoryApi";

interface Category {
  _id: string;
  categoryName: string;
  slug: string;
  status: number;
}

export default function VideoCategory() {
  const canAdd = hasPermission("videocategory", "add");
  const canEdit = hasPermission("videocategory", "edit");
  const canDelete = hasPermission("videocategory", "delete");

  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // Modal
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");

  // Form
  const [formData, setFormData] = useState({
    categoryName: "",
    slug: "",
  });

  const [errors, setErrors] = useState({
    categoryName: "",
  });

  // ==========================
  // Get Categories
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories(page, search);
  }, [page]);
  // ==========================
  // Open Add Modal
  // ==========================

  const openAddModal = () => {
    setIsEdit(false);
    setEditId("");

    setFormData({
      categoryName: "",
      slug: "",
    });

    setErrors({
      categoryName: "",
    });

    setIsOpen(true);
  };

  // ==========================
  // Open Edit Modal
  // ==========================

  const openEditModal = (item: Category) => {
    setIsEdit(true);
    setEditId(item._id);

    setFormData({
      categoryName: item.categoryName,
      slug: item.slug,
    });

    setErrors({
      categoryName: "",
    });

    setIsOpen(true);
  };
  // ==========================
  // Input Change
  // ==========================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "categoryName") {
      setFormData({
        categoryName: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      });

      setErrors({
        categoryName: "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ==========================
  // Add / Update Category
  // ==========================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.categoryName.trim()) {
      setErrors({
        categoryName: "Category Name is required",
      });

      return;
    }

    try {
      let response;

      if (isEdit) {
        response = await updateCategoryApi(editId, formData);
      } else {
        response = await addCategoryApi(formData);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        fetchCategories();

        setIsOpen(false);

        setFormData({
          categoryName: "",
          slug: "",
        });

        setErrors({
          categoryName: "",
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
      const response = await changeCategoryStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  // ==========================
  // Delete Category
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
      const response = await deleteCategoryApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Video Category" />

      <div className="space-y-6">
        <ComponentCard title="Video Category">
          <div className="mb-5 flex justify-end">
            {canAdd && (
              <button
                onClick={openAddModal}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Category
              </button>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto">
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
                <TableHeader className="border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Sr No
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      Category Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      Slug
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : categories.length > 0 ? (
                    categories.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-6 py-4 text-center">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          {item.categoryName}
                        </TableCell>

                        <TableCell className="px-6 py-4">{item.slug}</TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleStatus(item._id)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                              item.status === 1 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
                                item.status === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {canEdit && (
                              <button
                                onClick={() => openEditModal(item)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 transition hover:bg-red-600 hover:text-white"
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
                      <TableCell colSpan={5} className="py-10 text-center">
                        No Category Found
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
          {/* Add / Edit Category Modal */}
          {isOpen && (
            <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h3 className="text-lg font-semibold">
                    {isEdit ? "Edit Video Category" : "Add Video Category"}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl leading-none text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5 p-6">
                    {/* Category Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Category Name
                      </label>

                      <input
                        type="text"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        placeholder="Enter Category Name"
                        className={`h-11 w-full rounded-lg border px-4 ${
                          errors.categoryName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />

                      {errors.categoryName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.categoryName}
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
                        className="h-11 w-full rounded-lg border border-gray-300 px-4"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-3 border-t px-6 py-4">
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
                      {isEdit ? "Update Category" : "Add Category"}
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
