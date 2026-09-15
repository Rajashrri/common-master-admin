import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Pencil, Trash2, FileCode2, Search } from "lucide-react";
import { hasPermission } from "../../utils/permission";

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
  getVideosApi,
  deleteVideoApi,
  changeVideoStatusApi,
  changeFeaturedApi,
} from "../../api/videoApi";

interface Video {
  _id: string;
  title: string;
  youtubeLink: string;
  featured: number;
  status: number;

  categoryId: {
    categoryName: string;
  };
}

export default function VideoList() {
  const canAdd = hasPermission("video", "add");
  const canEdit = hasPermission("video", "edit");
  const canDelete = hasPermission("video", "delete");

  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchVideos = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getVideosApi(pageNo, 10, searchText);

      if (response.data.success) {
        setVideos(response.data.data);
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
    fetchVideos(page, search);
  }, [page]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Video?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteVideoApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchVideos();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const response = await changeVideoStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchVideos();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleFeatured = async (id: string) => {
    try {
      const response = await changeFeaturedApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchVideos();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Video List" />

      <div className="space-y-6">
        <ComponentCard title="Video List">
          
          <div className="mb-5 flex justify-end">
            {canAdd && (
              <Link
                to="/add-video"
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Video
              </Link>
            )}
          </div>
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Videos ({videos.length})
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
                      fetchVideos(1, e.target.value);
                    }}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Sr No
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Category
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold"
                    >
                      Video Title
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
                      <TableCell colSpan={7}>Loading...</TableCell>
                    </TableRow>
                  ) : videos.length ? (
                    videos.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-6 py-4 font-medium">
                          {index + 1}
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium">
                          {item.categoryId?.categoryName}
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium">
                          {item.title}
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium">
                          <button
                            onClick={() => handleStatus(item._id)}
                            className={`relative inline-flex h-5 w-10 rounded-full ${
                              item.status ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                                item.status
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium">
                          <button
                            onClick={() => handleFeatured(item._id)}
                            className={`relative inline-flex h-5 w-10 rounded-full ${
                              item.featured ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                                item.featured
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </TableCell>

                        <TableCell className="px-6 py-4 font-medium">
                          <div className="flex gap-2">
                            {canEdit && (
                              <Link
                                to={`/edit-video/${item._id}`}
                                className="rounded bg-blue-100 p-2 text-blue-600"
                              >
                                <Pencil size={16} />
                              </Link>
                            )}

                            <Link
                              to={`/video-seo/${item._id}`}
                              className="rounded bg-green-100 p-2 text-green-600"
                            >
                              <FileCode2 size={16} />
                            </Link>
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="rounded bg-red-100 p-2 text-red-600"
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
                      <TableCell colSpan={7}>No Videos Found</TableCell>
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
