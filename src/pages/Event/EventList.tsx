import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Pencil, Trash2, Search } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { hasPermission } from "../../utils/permission";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  getEventsApi,
  deleteEventApi,
  changeEventStatusApi,
  changeEventFeaturedApi,
} from "../../api/eventApi";

interface EventType {
  _id: string;
  title: string;
  slug: string;

  categoryId: {
    _id: string;
    categoryName: string;
  };

  fromDate: string;
  endDate: string;

  timing: string;

  entryFee: string;

  mainImage: string;

  status: number;

  featured: number;
}

export default function EventList() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const canAdd = hasPermission("event", "add");
  const canEdit = hasPermission("event", "edit");
  const canDelete = hasPermission("event", "delete");

  useEffect(() => {
    fetchEvents(page, search);
  }, [page]);

  // ===========================
  // Event List
  // ===========================

  const fetchEvents = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getEventsApi(pageNo, 10, searchText);

      if (response.data.success) {
        setEvents(response.data.data);
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
  // Format Date
  // ===========================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  // ===========================
  // Delete Event
  // ===========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Event?",

      text: "You won't be able to revert this!",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#3085d6",

      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteEventApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchEvents();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to delete event");
    }
  };

  // ===========================
  // Change Status
  // ===========================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeEventStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchEvents();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  // ===========================
  // Change Featured
  // ===========================

  const handleFeatured = async (id: string) => {
    try {
      const response = await changeEventFeaturedApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchEvents();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to update featured");
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Event List" />

      <div className="space-y-6">
        <ComponentCard title="Event List">
          {/* Header */}

          <div className="mb-5 flex items-center justify-end">
            {canAdd && (
              <Link
                to="/add-event"
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                + Add Event
              </Link>
            )}
          </div>

          {/* Table */}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Events ({events.length})
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
                      fetchEvents(1, e.target.value);
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
                      Category
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 font-medium">
                      Event Title
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
                      Featured
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
                      <TableCell colSpan={8} className="py-8 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : events.length > 0 ? (
                    events.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-5 py-4 text-center">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {item.categoryId?.categoryName}
                        </TableCell>

                        <TableCell className="px-5 py-4 font-medium">
                          {item.title}
                        </TableCell>

                        {/* Status */}

                        <TableCell className="px-5 py-4 text-center">
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

                        {/* Featured */}

                        <TableCell className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleFeatured(item._id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                              item.featured === 1
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                                item.featured === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />

                            <span
                              className={`absolute text-[9px] font-bold ${
                                item.featured === 1
                                  ? "left-1 text-white"
                                  : "right-1 text-gray-700"
                              }`}
                            >
                              {item.featured === 1 ? "YES" : "NO"}
                            </span>
                          </button>
                        </TableCell>

                        {/* Action */}

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit */}
                            {canEdit && (
                              <Link
                                to={`/edit-event/${item._id}`}
                                className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </Link>
                            )}
                            {/* SEO */}

                            <Link
                              to={`/event-seo/${item._id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white transition hover:bg-emerald-700"
                              title="SEO"
                            >
                              <Search size={15} />
                            </Link>

                            {/* Delete */}
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
                      <TableCell colSpan={8} className="py-8 text-center">
                        No Events Found
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
      </div>
    </>
  );
}
