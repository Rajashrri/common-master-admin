import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { getFaqsApi, deleteFaqApi, changeFaqStatusApi } from "../../api/faqApi";
import { hasPermission } from "../../utils/permission";

import { Pencil, Trash2, Search } from "lucide-react";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  status: number;

  categoryId?: {
    categoryName: string;
  };
}

export default function FaqList() {
  const canAdd = hasPermission("faq", "add");
  const canEdit = hasPermission("faq", "edit");
  const canDelete = hasPermission("faq", "delete");

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaqs(page, search);
  }, [page]);
  // ==========================
  // Fetch FAQ
  // ==========================

  const fetchFaqs = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getFaqsApi(pageNo, 10, searchText);

      if (response.data.success) {
        setFaqs(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: "You won't be able to recover this FAQ!",
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
      const response = await deleteFaqApi(id);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      fetchFaqs();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  // ==========================
  // Status
  // ==========================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeFaqStatusApi(id);

      toast.success(response.data.message);

      fetchFaqs();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  // ==========================
  // Search
  // ==========================

  const filteredFaqs = faqs.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageBreadcrumb pageTitle="FAQ List" />

      <div className="space-y-6">
        <ComponentCard title="All FAQs">
          {/* Header */}

          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            {canAdd && (
              <Link
                to="/add-faq"
                className="rounded-lg bg-brand-500 px-5 py-3 text-white hover:bg-brand-600"
              >
                + Add FAQ
              </Link>
            )}
          </div>

          {/* Table */}

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Total FAQS ({faqs.length})
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
                    fetchFaqs(1, e.target.value);
                  }}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-center w-20">
                    Sr. No.
                  </th>

                  <th className="border-b px-4 py-3 text-left">Question</th>

                  <th className="border-b px-4 py-3 text-left">Category</th>

                  <th className="border-b px-4 py-3 text-center">Status</th>

                  <th className="border-b px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                        <p className="text-sm text-gray-500">Loading FAQs...</p>
                      </div>
                    </td>
                  </tr>
                ) : faqs.length > 0 ? (
                  faqs.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {/* Sr No */}
                      <td className="px-4 py-3 text-center font-medium">
                        {(page - 1) * 10 + index + 1}
                      </td>

                      {/* Question */}
                      <td className="px-4 py-3 font-medium">{item.question}</td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        {item.categoryId?.categoryName}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={item.status === 1}
                            onChange={() => handleStatus(item._id)}
                            className="peer sr-only"
                          />

                          <div className="peer h-6 w-11 rounded-full bg-gray-300 transition-all peer-checked:bg-green-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                        </label>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {canEdit && (
                            <Link
                              to={`/edit-faq/${item._id}`}
                              title="Edit"
                              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                            >
                              <Pencil size={16} />
                            </Link>
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
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No FAQs Found
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
      </div>
    </>
  );
}
