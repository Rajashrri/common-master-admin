import { useEffect, useState } from "react";
import { Link } from "react-router";
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
  getGalleryApi,
  deleteGalleryApi,
  changeGalleryStatusApi,
} from "../../api/galleryApi";

interface Gallery {
  _id: string;
  categoryId: {
    categoryName: string;
  };
  imageName: string;
  image: string;
  status: number;
}

export default function GalleryList() {
  const canAdd = hasPermission("gallery", "add");
  const canEdit = hasPermission("gallery", "edit");
  const canDelete = hasPermission("gallery", "delete");

  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchGallery = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getGalleryApi(pageNo, 10, searchText);

      if (response.data.success) {
        setGallery(response.data.data);
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
    fetchGallery(page, search);
  }, [page]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Gallery?",
      text: "You won't be able to recover this image.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    const response = await deleteGalleryApi(id);

    if (response.data.success) {
      toast.success(response.data.message);
      fetchGallery();
    }
  };

  const handleStatus = async (id: string) => {
    const response = await changeGalleryStatusApi(id);

    if (response.data.success) {
      toast.success(response.data.message);
      fetchGallery();
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Gallery List" />

      <div className="space-y-6">
        <ComponentCard title="Gallery List">
          
          <div className="mb-5 flex justify-end">
            {canAdd && (
              <Link
                to="/add-gallery"
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Gallery
              </Link>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Gallery ({gallery.length})
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
                      fetchGallery(1, e.target.value);
                    }}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableCell className="px-6 py-4 text-center text-sm font-semibold">
                      Sr No
                    </TableCell>

                    <TableCell className="px-6 py-4">Category</TableCell>

                    <TableCell className="px-6 py-4">Image</TableCell>

                    <TableCell className="px-6 py-4">Image Name</TableCell>

                    <TableCell className="px-6 py-4">Status</TableCell>

                    <TableCell className="px-6 py-4">Action</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : gallery.length > 0 ? (
                    gallery.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-6 py-4">{index + 1}</TableCell>

                        <TableCell className="px-6 py-4">
                          {item.categoryId?.categoryName}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <img
                            src={item.image}
                            className="h-16 w-20 rounded-lg object-cover"
                          />
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          {item.imageName}
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <button
                            onClick={() => handleStatus(item._id)}
                            className={`relative inline-flex h-5 w-10 rounded-full ${
                              item.status === 1 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                                item.status === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </TableCell>

                        <TableCell className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {canEdit && (
                              <Link
                                to={`/edit-gallery/${item._id}`}
                                className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-600 hover:text-white"
                              >
                                <Pencil size={16} />
                              </Link>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-600 hover:text-white"
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
                      <TableCell colSpan={6} className="py-10 text-center">
                        No Gallery Found
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
