import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { Pencil, Trash2, Search, X } from "lucide-react";
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
} from "../../api/projectCategoryApi";

interface Category {
  _id: string;
  categoryName: string;
  slug: string;
  status: number;
}

export default function ProjectCategory() {
  const canAdd = hasPermission("projectcategory", "add");
  const canEdit = hasPermission("projectcategory", "edit");
  const canDelete = hasPermission("projectcategory", "delete");

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  useEffect(() => {
    fetchCategories(page, search);
  }, [page]);

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

  // ==========================
  // Search
  // ==========================

  const filteredCategories = categories.filter((item) =>
    item.categoryName.toLowerCase().includes(search.toLowerCase()),
  );

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
  // Handle Change
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
  // Submit
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
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Project Category" />

      <div className="space-y-6">
        <ComponentCard title="Project Category">
          {/* Header */}
          <div className="mb-5 flex items-center justify-end">
            {canAdd && (
              <button
                onClick={openAddModal}
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Category
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
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 text-center text-sm font-semibold"
                  >
                    {" "}
                    Sr. No.
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-6 py-4 text-center text-sm font-semibold"
                  >
                    Category Name
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-6 py-4 text-center text-sm font-semibold"
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
                    <TableCell colSpan={5} className="py-8 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((item, index) => (
                    <TableRow key={item._id}>
                      <TableCell className="px-6 py-4 text-center">
                        {index + 1}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        {item.categoryName}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        {item.slug}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={item.status === 1}
                            onChange={async () => {
                              await changeCategoryStatusApi(item._id);

                              fetchCategories();
                            }}
                            className="peer sr-only"
                          />

                          <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-5"></div>
                        </label>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(item)}
                              className="rounded-lg bg-blue-600 p-2 text-white"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={async () => {
                                const result = await Swal.fire({
                                  title: "Delete Category?",

                                  text: "You won't be able to recover this category!",

                                  icon: "warning",

                                  showCancelButton: true,

                                  confirmButtonText: "Yes, Delete",

                                  cancelButtonText: "Cancel",

                                  confirmButtonColor: "#dc2626",
                                });

                                if (!result.isConfirmed) return;

                                await deleteCategoryApi(item._id);

                                toast.success("Category Deleted Successfully");

                                fetchCategories();
                              }}
                              className="rounded-lg bg-red-600 p-2 text-white"
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
                      No Categories Found
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
          {/* Modal */}

          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h2 className="text-lg font-semibold">
                    {isEdit ? "Edit Project Category" : "Add Project Category"}
                  </h2>

                  <button onClick={() => setIsOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                {/* Form */}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-5 p-6">
                    {/* Category */}

                    <div>
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

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Slug
                      </label>

                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
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
                      {isEdit ? "Update Category" : "Save Category"}
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
