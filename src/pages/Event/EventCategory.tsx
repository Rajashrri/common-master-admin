import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Pencil, Trash2, Search } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { hasPermission } from "../../utils/permission";

import {
  addEventCategoryApi,
  getEventCategoriesApi,
  getEventCategoryByIdApi,
  updateEventCategoryApi,
  deleteEventCategoryApi,
  changeEventCategoryStatusApi,
} from "../../api/eventCategoryApi";

interface Category {
  _id: string;
  categoryName: string;
  slug: string;
  status: number;
}

export default function EventCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [editId, setEditId] = useState("");
  const canAdd = hasPermission("eventcategory", "add");
  const canEdit = hasPermission("eventcategory", "edit");
  const canDelete = hasPermission("eventcategory", "delete");

  const [formData, setFormData] = useState({
    categoryName: "",
    slug: "",
  });

  const [errors, setErrors] = useState<any>({});

  // ==========================
  // Category List
  // ==========================

  const fetchCategories = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getEventCategoriesApi(pageNo, 10, searchText);

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
  // Handle Input
  // ==========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "categoryName") {
      setFormData({
        categoryName: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // ==========================
  // Add Modal
  // ==========================

  const openAddModal = () => {
    setIsEdit(false);

    setEditId("");

    setFormData({
      categoryName: "",
      slug: "",
    });

    setErrors({});

    setIsOpen(true);
  };

  // ==========================
  // Edit Modal
  // ==========================

  const openEditModal = async (item: Category) => {
    try {
      const response = await getEventCategoryByIdApi(item._id);

      if (response.data.success) {
        setIsEdit(true);

        setEditId(item._id);

        setFormData({
          categoryName: response.data.data.categoryName,
          slug: response.data.data.slug,
        });

        setErrors({});

        setIsOpen(true);
      }
    } catch (error) {
      toast.error("Unable to load category.");
    }
  };

  // ==========================
  // Save
  // ==========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.categoryName.trim()) {
      err.categoryName = "Category Name is required";
    }

    if (!formData.slug.trim()) {
      err.slug = "Slug is required";
    }

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      let response;

      if (isEdit) {
        response = await updateEventCategoryApi(editId, formData);
      } else {
        response = await addEventCategoryApi(formData);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        setIsOpen(false);

        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };
  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteEventCategoryApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  // ==========================
  // Status
  // ==========================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeEventCategoryStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Event Category" />

      <div className="space-y-6">
        <ComponentCard title="Event Category">
          {/* Header */}

          <div className="mb-5 flex justify-end">
            {canAdd && (
              <button
                onClick={openAddModal}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
              >
                + Add Category
              </button>
            )}
          </div>

          {/* Table */}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-white/[0.03]">
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
                <TableHeader className="border-b border-gray-200 bg-gray-100">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-center font-semibold"
                    >
                      Sr No
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 font-semibold">
                      Category Name
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 font-semibold">
                      Slug
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-center font-semibold"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 text-center font-semibold"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : categories.length > 0 ? (
                    categories.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <TableCell className="px-5 py-4 text-center">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4 font-medium">
                          {item.categoryName}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-gray-500">
                          {item.slug}
                        </TableCell>

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
                          <div className="flex justify-center gap-2">
                            {canEdit && (
                              <button
                                onClick={() => openEditModal(item)}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-white transition hover:bg-red-700"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        No Event Categories Found
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
              <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl dark:bg-gray-900">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                  <h3 className="text-lg font-semibold">
                    {isEdit ? "Edit Event Category" : "Add Event Category"}
                  </h3>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl text-gray-500 transition hover:text-red-500"
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
                        className={`w-full rounded-lg border px-4 py-3 transition focus:outline-none ${
                          errors.categoryName
                            ? "border-red-500"
                            : "border-gray-300 focus:border-brand-500"
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
                        placeholder="event-category"
                        className={`w-full rounded-lg border px-4 py-3 transition focus:outline-none ${
                          errors.slug
                            ? "border-red-500"
                            : "border-gray-300 focus:border-brand-500"
                        }`}
                      />

                      {errors.slug && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.slug}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer */}

                  <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg border border-gray-300 px-5 py-2 transition hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-5 py-2 text-white transition hover:bg-brand-600"
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
