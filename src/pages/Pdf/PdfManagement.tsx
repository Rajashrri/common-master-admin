import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { Search, Pencil, Trash2, Plus, Eye, Download, X } from "lucide-react";

import {
  getPdfsApi,
  addPdfApi,
  updatePdfApi,
  deletePdfApi,
  changePdfStatusApi,
} from "../../api/pdfApi";

import { hasPermission } from "../../utils/permission";

interface PdfType {
  _id: string;
  pdfName: string;
  pdfFile: string;
  status: number;
}

export default function PdfManagement() {
  const [pdfs, setPdfs] = useState<PdfType[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState<any>({});
  const [totalPages, setTotalPages] = useState(1);

  const canAdd = hasPermission("pdf", "add");
  const canEdit = hasPermission("pdf", "edit");
  const canDelete = hasPermission("pdf", "delete");

  const [formData, setFormData] = useState({
    pdfName: "",
    pdfFile: null as File | null,
  });

  useEffect(() => {
    fetchPdfs(page, search);
  }, [page]);

  const fetchPdfs = async (pageNo = page, searchText = search) => {
    try {
      setLoading(true);

      const response = await getPdfsApi(pageNo, 10, searchText);
      if (response.data.success) {
        setPdfs(response.data.data);
        setPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load PDFs");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "pdfFile") {
      setFormData((prev) => ({
        ...prev,
        pdfFile: e.target.files?.[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors({
      ...errors,
      [name]: "",
    });
  };
  const validate = () => {
    let err: any = {};

    if (!formData.pdfName.trim()) {
      err.pdfName = "PDF Name is required";
    }

    if (!editId && !formData.pdfFile) {
      err.pdfFile = "PDF File is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };
  const openAddModal = () => {
    setEditId("");

    setErrors({});

    setFormData({
      pdfName: "",

      pdfFile: null,
    });

    setOpenModal(true);
  };
  const openEditModal = (item: PdfType) => {
    setEditId(item._id);

    setErrors({});

    setFormData({
      pdfName: item.pdfName,

      pdfFile: null,
    });

    setOpenModal(true);
  };
  // ==========================
  // Save (Add / Update)
  // ==========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const data = new FormData();

      data.append("pdfName", formData.pdfName);

      if (formData.pdfFile) {
        data.append("pdfFile", formData.pdfFile);
      }

      let response;

      if (editId) {
        response = await updatePdfApi(editId, data);
      } else {
        response = await addPdfApi(data);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        fetchPdfs();

        setOpenModal(false);

        setFormData({
          pdfName: "",
          pdfFile: null,
        });

        setEditId("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete PDF?",

      text: "You won't be able to recover it!",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#dc2626",

      cancelButtonColor: "#6b7280",

      confirmButtonText: "Yes, Delete",

      cancelButtonText: "Cancel",

      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deletePdfApi(id);

      Swal.fire({
        icon: "success",

        title: "Deleted!",

        text: response.data.message,

        timer: 1500,

        showConfirmButton: false,
      });

      fetchPdfs();
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
      const response = await changePdfStatusApi(id);

      toast.success(response.data.message);

      fetchPdfs();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  // ==========================
  // Close Modal
  // ==========================

  const closeModal = () => {
    setOpenModal(false);

    setEditId("");

    setErrors({});

    setFormData({
      pdfName: "",

      pdfFile: null,
    });
  };
  return (
    <>
      <PageBreadcrumb pageTitle="PDF Management" />

      <div className="space-y-6">
        <ComponentCard title="PDF Management">
          {/* Header */}

          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
            {canAdd && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-white hover:bg-brand-600"
              >
                <Plus size={18} />
                Add PDF
              </button>
            )}
          </div>

          {/* Table */}

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Total PDF ({pdfs.length})
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
                    fetchPdfs(1, e.target.value);
                  }}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-center w-20">
                    Sr. No.
                  </th>

                  <th className="border-b px-4 py-3 text-left">PDF Name</th>

                  <th className="border-b px-4 py-3 text-center">PDF</th>

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
                ) : pdfs.length > 0 ? (
                  pdfs.map((item, index) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      {/* Sr No */}
                      <td className="px-4 py-3 text-center">
                        {(page - 1) * 10 + index + 1}
                      </td>

                      {/* PDF Name */}
                      <td className="px-4 py-3 font-medium">{item.pdfName}</td>

                      {/* View / Download */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <a
                            href={item.pdfFile}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                            title="View"
                          >
                            <Eye size={16} />
                          </a>

                          <a
                            href={item.pdfFile}
                            download
                            className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                            title="Download"
                          >
                            <Download size={16} />
                          </a>
                        </div>
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
                              onClick={() => openEditModal(item)}
                              title="Edit"
                              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(item._id)}
                              title="Delete"
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
                      No PDF Found
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
          {/* Modal */}

          {openModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h2 className="text-lg font-semibold">
                    {editId ? "Edit PDF" : "Add PDF"}
                  </h2>

                  <button
                    onClick={closeModal}
                    className="rounded p-1 hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form */}

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                  {/* PDF Name */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      PDF Name
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="pdfName"
                      value={formData.pdfName}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4 focus:border-brand-500 focus:outline-none"
                    />

                    {errors.pdfName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.pdfName}
                      </p>
                    )}
                  </div>

                  {/* Upload PDF */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Upload PDF
                      {!editId && <span className="text-red-500">*</span>}
                    </label>

                    <input
                      type="file"
                      name="pdfFile"
                      accept=".pdf"
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 p-2"
                    />

                    {errors.pdfFile && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.pdfFile}
                      </p>
                    )}

                    {editId && (
                      <p className="mt-2 text-xs text-gray-500">
                        Leave empty if you don't want to change the PDF.
                      </p>
                    )}
                  </div>

                  {/* Buttons */}

                  <div className="flex justify-end gap-3 border-t pt-5">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
                    >
                      {loading
                        ? editId
                          ? "Updating..."
                          : "Saving..."
                        : editId
                          ? "Update PDF"
                          : "Save PDF"}
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
