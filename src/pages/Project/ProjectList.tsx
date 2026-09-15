import { useEffect, useState } from "react";
import { Link } from "react-router";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { Pencil, Trash2, FileCode2 } from "lucide-react";
import { Search } from "lucide-react";

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
  getProjectsApi,
  deleteProjectApi,
  changeProjectStatusApi,
  changeProjectFeaturedApi,
} from "../../api/projectApi";

interface Project {
  _id: string;
  name: string;
  mainImage: string;
  featuredImage: string;
  status: number;
  featured: number;

  categoryId: {
    _id: string;
    categoryName: string;
  };
}

const ProjectList = () => {
  const canAdd = hasPermission("project", "add");
  const canEdit = hasPermission("project", "edit");
  const canDelete = hasPermission("project", "delete");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchProjects = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getProjectsApi(pageNo, 10, searchText);

      if (response.data.success) {
        setProjects(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects(page, search);
  }, [page]);
  const handleStatus = async (id: string) => {
    try {
      const response = await changeProjectStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchProjects();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to change status");
    }
  };
  // ==========================
  // Change Featured Status
  // ==========================

  const handleFeatured = async (id: string) => {
    try {
      const response = await changeProjectFeaturedApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchProjects();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Unable to change featured status",
      );
    }
  };

  // ==========================
  // Delete Project
  // ==========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Project?",

      text: "You won't be able to recover this project.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#dc2626",

      confirmButtonText: "Delete",

      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteProjectApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchProjects();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to delete project");
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Project List" />

      <div className="space-y-6">
        <ComponentCard title="Project List">

          
          <div className="mb-5 flex justify-end">
            {canAdd && (
              <Link
                to="/add-project"
                className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Add Project
              </Link>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Projects ({projects.length})
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
                      fetchProjects(1, e.target.value);
                    }}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3">
                      Sr No
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
                      Category
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
                      Project Name
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
                      Featured
                    </TableCell>

                    <TableCell isHeader className="text-center">
                      Status
                    </TableCell>

                    <TableCell isHeader className="px-5 py-3">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {" "}
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : projects.length > 0 ? (
                    projects.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className="px-5 py-4">{index + 1}</TableCell>

                        <TableCell className="px-5 py-4">
                          {item.categoryId?.categoryName}
                        </TableCell>

                        <TableCell className="px-5 py-4">{item.name}</TableCell>

                        {/* Featured */}

                        <TableCell className="px-5 py-4">
                          <button
                            onClick={() => handleFeatured(item._id)}
                            className={`relative inline-flex h-5 w-10 rounded-full ${
                              item.featured === 1
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                                item.featured === 1
                                  ? "translate-x-5"
                                  : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </TableCell>

                        {/* Status */}

                        <TableCell className="px-5 py-4">
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

                        {/* Actions */}

                        <TableCell className="px-5 py-4">
                          <div className="flex justify-center gap-2">
                            {canEdit && (
                              <Link
                                to={`/edit-project/${item._id}`}
                                className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-600 hover:text-white"
                              >
                                <Pencil size={16} />
                              </Link>
                            )}
                            <Link
                              to={`/project-seo/${item._id}`}
                              className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-600 hover:text-white"
                            >
                              <FileCode2 size={16} />
                            </Link>
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
                      <TableCell colSpan={7} className="py-10 text-center">
                        No Projects Found
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
};

export default ProjectList;
