import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Pencil, Trash2, FileCode2, Search } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  getServicesApi,
  deleteServiceApi,
  changeServiceStatusApi,
  changeServiceFeaturedApi,
} from "../../api/serviceApi";
import { hasPermission } from "../../utils/permission";

export default function Service() {
  const canAdd = hasPermission("service", "add");
  const canEdit = hasPermission("service", "edit");
  const canDelete = hasPermission("service", "delete");

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const fetchServices = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getServicesApi(pageNo, 10, searchText);

      if (response.data.success) {
        setServices(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(page, search);
  }, [page]);
  // ===========================
  // Change Status
  // ===========================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeServiceStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchServices();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  // ===========================
  // Change Featured
  // ===========================

  const handleFeatured = async (id: string) => {
    try {
      const response = await changeServiceFeaturedApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchServices();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Featured update failed");
    }
  };

  // ===========================
  // Delete Service
  // ===========================

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
      const response = await deleteServiceApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchServices();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Services" />

      <div className="space-y-6">
        <ComponentCard title="Services">
          {/* Header */}

          <div className="mb-5 flex justify-end">
            {canAdd && (
              <Link
                to="/add-service"
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Service
              </Link>
            )}
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Services ({services.length})
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
                      fetchServices(1, e.target.value);
                    }}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-center">
                      Sr No
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
                      Service
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
                      Category
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-center">
                      Featured
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-center">
                      Status
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3 text-center">
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
                  ) : services.length > 0 ? (
                    services.map((item: any, index: number) => (
                      <TableRow key={item._id}>
                        {/* Sr No */}

                        <TableCell className="px-5 py-4 text-center">
                          {index + 1}
                        </TableCell>

                        {/* Service */}

                        <TableCell className="px-5 py-4">
                          <div className="font-medium">{item.serviceName}</div>

                          <div className="text-xs text-gray-500">
                            {item.slug}
                          </div>
                        </TableCell>

                        {/* Category */}

                        <TableCell className="px-5 py-4">
                          {item.categoryId?.categoryName}
                        </TableCell>
                        {/* Featured Toggle */}

                        <TableCell className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleFeatured(item._id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                              item.featured === 1
                                ? "bg-blue-500"
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

                        {/* Status Toggle */}

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

                        {/* Action */}
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit */}
                            {canEdit && (
                              <Link
                                to={`/edit-service/${item._id}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
                                title="Edit"
                              >
                                <Pencil size={16} strokeWidth={2} />
                              </Link>
                            )}
                            {/* SEO */}
                            <Link
                              to={`/service/seo/${item._id}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-all duration-200 hover:bg-emerald-600 hover:text-white"
                              title="SEO"
                            >
                              <FileCode2 size={16} strokeWidth={2} />
                            </Link>

                            {/* Delete */}
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
                      <TableCell colSpan={6} className="py-8 text-center">
                        No Service Found
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
