import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Pencil, Trash2, FileCode2 } from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  getNewsApi,
  deleteNewsApi,
  changeNewsFeaturedApi,
  changeNewsStatusApi,
} from "../../api/newsApi";

import { hasPermission } from "../../utils/permission";

interface News {
  _id: string;
  title: string;
  categoryId: {
    categoryName: string;
  };
  status: number;
  featured: number;
}

export default function NewsList() {
  const canAdd = hasPermission("news", "add");
  const canEdit = hasPermission("news", "edit");
  const canDelete = hasPermission("news", "delete");

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchNews = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getNewsApi(pageNo, 10, searchText);

      if (response.data.success) {
        setNews(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load News Categories");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchNews(page);
  }, [page]);

  const handleFeatured = async (id: string) => {
    try {
      const response = await changeNewsFeaturedApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchNews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Featured update failed");
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const response = await changeNewsStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchNews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Status update failed");
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
      const response = await deleteNewsApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchNews();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="News List" />

      <div className="space-y-6">
        <ComponentCard title="News List">
          
          <div className="mb-5 flex justify-end">
            {canAdd && (
              <Link
                to="/add-news"
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add News
              </Link>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total News ({news.length})
                </h3>

                <div className="relative w-full max-w-md">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search news by title or author..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                      fetchNews(1, e.target.value);
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
                      Category
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-left text-sm font-semibold"
                    >
                      News Title
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
                      Featured
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
                  ) : news.length > 0 ? (
                    news.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                      >
                        {/* Sr No */}
                        <TableCell className="px-6 py-4 text-center font-medium">
                          {(page - 1) * 10 + index + 1}
                        </TableCell>

                        {/* Category */}
                        <TableCell className="px-6 py-4 font-medium">
                          {item.categoryId?.categoryName}
                        </TableCell>

                        {/* Title */}
                        <TableCell className="px-6 py-4 max-w-md">
                          <p className="truncate font-medium">{item.title}</p>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleStatus(item._id)}
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

                        {/* Featured */}
                        <TableCell className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleFeatured(item._id)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
                              item.featured === 1
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                                item.featured === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />

                            <span
                              className={`absolute text-[8px] font-semibold ${
                                item.featured === 1
                                  ? "left-1 text-white"
                                  : "right-1 text-gray-700"
                              }`}
                            >
                              {item.featured === 1 ? "ON" : "OFF"}
                            </span>
                          </button>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit */}
                            {canEdit && (
                              <Link
                                to={`/edit-news/${item._id}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
                                title="Edit"
                              >
                                <Pencil size={16} strokeWidth={2} />
                              </Link>
                            )}
                            {/* SEO */}
                            <Link
                              to={`/news-seo/${item._id}`}
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
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        No News Found
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
