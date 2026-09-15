import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Pencil, Trash2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";
import { hasPermission } from "../../utils/permission";

import {
  getTestimonialsApi,
  deleteTestimonialApi,
  changeTestimonialStatusApi,
} from "../../api/testimonialApi";

interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  briefIntro: string;
  image: string;
  status: number;
}

export default function TestimonialList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIntro, setSelectedIntro] = useState("");
  const [showModal, setShowModal] = useState(false);

  const canAdd = hasPermission("testimonial", "add");
  const canEdit = hasPermission("testimonial", "edit");
  const canDelete = hasPermission("testimonial", "delete");

  const fetchTestimonials = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getTestimonialsApi(pageNo, 10, searchText);

      if (response.data.success) {
        setTestimonials(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.log("Testimonial Fetch Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(page, search);
  }, [page]);
  const handleStatusChange = async (id: string) => {
    try {
      const response = await changeTestimonialStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };
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
      const response = await deleteTestimonialApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Testimonial List" />

      <div className="space-y-6">
        <ComponentCard title="Testimonial List">
          
          <div className="mb-5 flex justify-end">
            {canAdd && (
              <Link
                to="/add-testimonial"
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Testimonial
              </Link>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Testimonials ({testimonials.length})
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
                      fetchTestimonials(1, e.target.value);
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
                      Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      Designation
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Brief Intro
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
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : testimonials.length > 0 ? (
                    testimonials.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                      >
                        <TableCell className="px-6 py-4 text-center font-medium">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium">
                          {item.name}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          {item.designation}
                        </TableCell>

                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedIntro(item.briefIntro);
                              setShowModal(true);
                            }}
                            className="rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200"
                          >
                            View
                          </button>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleStatusChange(item._id)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
                              item.status === 1 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                                item.status === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />

                            <span
                              className={`absolute text-[8px] font-semibold ${
                                item.status === 1
                                  ? "left-1 text-white"
                                  : "right-1 text-gray-700"
                              }`}
                            >
                              {item.status === 1 ? "ON" : "OFF"}
                            </span>
                          </button>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit */}
                            {canEdit && (
                              <Link
                                to={`/edit-testimonial/${item._id}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
                                title="Edit"
                              >
                                <Pencil size={16} strokeWidth={2} />
                              </Link>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white"
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
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        No Testimonial Found
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
        </ComponentCard>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Brief Introduction</h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl font-bold text-gray-500 hover:text-black"
                >
                  ×
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedIntro}
                </p>
              </div>

              <div className="mt-5 text-right">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
