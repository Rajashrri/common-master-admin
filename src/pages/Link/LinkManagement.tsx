import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { Pencil, Trash2, Plus, Search, X } from "lucide-react";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { hasPermission } from "../../utils/permission";

import {
  addLinkApi,
  getLinksApi,
  updateLinkApi,
  deleteLinkApi,
  changeLinkStatusApi,
} from "../../api/linkApi";

interface LinkType {
  _id: string;
  linkName: string;
  link: string;
  status: number;
}

export default function LinkManagement() {
  const [links, setLinks] = useState<LinkType[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [editingId, setEditingId] = useState("");

  const canAdd = hasPermission("links", "add");
  const canEdit = hasPermission("links", "edit");
  const canDelete = hasPermission("links", "delete");

  const [formData, setFormData] = useState({
    linkName: "",
    link: "",
  });

  const [errors, setErrors] = useState<any>({});
  useEffect(() => {
    fetchLinks(page, search);
  }, [page, search]);

  // ======================
  // Fetch
  // ======================

  const fetchLinks = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getLinksApi(pageNo, 10, searchText);

      if (response.data.success) {
        setLinks(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load Links");
    } finally {
      setLoading(false);
    }
  };
  // ======================
  // Open Add Modal
  // ======================

  const openAdd = () => {
    setEditingId("");

    setFormData({
      linkName: "",
      link: "",
    });

    setErrors({});

    setOpenModal(true);
  };

  // ======================
  // Open Edit
  // ======================

  const openEdit = (item: LinkType) => {
    setEditingId(item._id);

    setFormData({
      linkName: item.linkName,
      link: item.link,
    });

    setErrors({});

    setOpenModal(true);
  };

  // ======================
  // Change
  // ======================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // ======================
  // Validation
  // ======================

  const validate = () => {
    let err: any = {};

    if (!formData.linkName.trim()) {
      err.linkName = "Link Name is required";
    }

    if (!formData.link.trim()) {
      err.link = "Link is required";
    } else {
      const regex = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;

      if (!regex.test(formData.link)) {
        err.link = "Enter valid URL";
      }
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };
  // ======================
  // Save
  // ======================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      let response;

      if (editingId) {
        response = await updateLinkApi(editingId, formData);
      } else {
        response = await addLinkApi(formData);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        setOpenModal(false);

        fetchLinks();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Delete
  // ======================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Link?",

      text: "This action cannot be undone.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, Delete",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#dc2626",

      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteLinkApi(id);

      Swal.fire({
        icon: "success",

        title: "Deleted",

        text: response.data.message,

        timer: 1500,

        showConfirmButton: false,
      });

      fetchLinks();
    } catch (error: any) {
      Swal.fire({
        icon: "error",

        title: "Error",

        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  // ======================
  // Status
  // ======================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeLinkStatusApi(id);

      toast.success(response.data.message);

      fetchLinks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ======================
  // Search
  // ======================

  return (
    <>
      <PageBreadcrumb pageTitle="Link Management" />

      <div className="space-y-6">
        <ComponentCard title="All Links">
          {/* Header */}

          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            {canAdd && (
              <button
                onClick={openAdd}
                className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-white"
              >
                <Plus size={18} />
                Add Link
              </button>
            )}
          </div>

          {/* Table */}

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Links ({links.length})
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
                    fetchLinks(1, e.target.value);
                  }}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-center w-20">Sr.</th>

                  <th className="border-b px-4 py-3 text-left">Link Name</th>

                  <th className="border-b px-4 py-3 text-left">Link</th>

                  <th className="border-b px-4 py-3 text-center">Status</th>

                  <th className="border-b px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : links.length > 0 ? (
                  links.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {/* Sr No */}
                      <td className="px-4 py-3 text-center">
                        {(page - 1) * 10 + index + 1}
                      </td>

                      {/* Link Name */}
                      <td className="px-4 py-3 font-medium">{item.linkName}</td>

                      {/* Link */}
                      <td className="px-4 py-3">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {item.link}
                        </a>
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
                        <div className="flex justify-center gap-2">
                          {canEdit && (
                            <button
                              title="Edit"
                              onClick={() => openEdit(item)}
                              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                            >
                              <Pencil size={16} />
                            </button>
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
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      No Links Found
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

        {/* Modal */}

        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white">
              <div className="flex items-center justify-between border-b p-5">
                <h3 className="text-lg font-semibold">
                  {editingId ? "Edit Link" : "Add Link"}
                </h3>

                <button onClick={() => setOpenModal(false)}>
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block">Link Name</label>

                  <input
                    type="text"
                    name="linkName"
                    value={formData.linkName}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border px-4"
                  />

                  {errors.linkName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.linkName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block">Link</label>

                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="h-11 w-full rounded-lg border px-4"
                  />

                  {errors.link && (
                    <p className="mt-1 text-sm text-red-500">{errors.link}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="rounded-lg border px-5 py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-brand-500 px-5 py-2 text-white"
                  >
                    {loading ? "Saving..." : editingId ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
