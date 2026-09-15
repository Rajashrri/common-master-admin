import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { Pencil, Trash2, ShieldCheck } from "lucide-react";
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
  addRoleApi,
  getRolesApi,
  getRoleDetailApi,
  updateRoleApi,
  deleteRoleApi,
  changeRoleStatusApi,
} from "../../api/roleMasterApi";

interface Role {
  _id: string;
  roleName: string;
  status: number;
}

export default function RoleMasterList() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState("");

  const [formData, setFormData] = useState({
    roleName: "",
  });

  const [errors, setErrors] = useState<any>({});

  // ===========================
  // Fetch Roles
  // ===========================

  const fetchRoles = async () => {
    try {
      setLoading(true);

      const response = await getRolesApi();

      if (response.data.success) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ===========================
  // Handle Input
  // ===========================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // ===========================
  // Open Add
  // ===========================

  const openAddModal = () => {
    setEditId("");

    setFormData({
      roleName: "",
    });

    setErrors({});

    setShowModal(true);
  };

  // ===========================
  // Open Edit
  // ===========================

  const openEditModal = async (id: string) => {
    try {
      const response = await getRoleDetailApi(id);

      if (response.data.success) {
        setEditId(id);

        setFormData({
          roleName: response.data.data.roleName,
        });

        setErrors({});

        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Save Role
  // ===========================

  const handleSubmit = async () => {
    const err: any = {};

    if (!formData.roleName.trim()) {
      err.roleName = "Role Name is required";
    }

    setErrors(err);

    if (Object.keys(err).length > 0) return;

    try {
      let response;

      if (editId) {
        response = await updateRoleApi(editId, formData);
      } else {
        response = await addRoleApi(formData);
      }

      if (response.data.success) {
        toast.success(response.data.message);

        setShowModal(false);

        fetchRoles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ===========================
  // Delete
  // ===========================

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Role?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteRoleApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchRoles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  // ===========================
  // Change Status
  // ===========================

  const handleStatus = async (id: string) => {
    try {
      const response = await changeRoleStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);

        fetchRoles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Role Master" />

      <div className="space-y-6">
        <ComponentCard title="Role Management">
          {/* Top Button */}

          <div className="mb-5 flex justify-end">
            <button
              onClick={openAddModal}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-brand-700"
            >
              + Add Role
            </button>
          </div>

          {/* Table */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <Table>
                {/* Header */}

                <TableHeader className="bg-gradient-to-r from-slate-800 to-slate-700">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold text-white"
                    >
                      #
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-sm font-semibold text-white"
                    >
                      Role Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold text-white"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold text-white"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-12 text-center text-gray-500"
                      >
                        Loading Roles...
                      </TableCell>
                    </TableRow>
                  ) : roles.length ? (
                    roles.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="h-20 border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        {/* Sr */}

                        <TableCell className="px-6 py-5 text-center font-semibold text-gray-600">
                          {index + 1}
                        </TableCell>

                        {/* Role */}

                        <TableCell className="px-6 py-5 font-semibold text-gray-800">
                          {item.roleName}
                        </TableCell>

                        {/* Status */}

                        <TableCell className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleStatus(item._id)}
                            className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300"
                            style={{
                              backgroundColor:
                                item.status === 1 ? "#22c55e" : "#d1d5db",
                            }}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-300 ${
                                item.status === 1
                                  ? "translate-x-8"
                                  : "translate-x-1"
                              }`}
                            />

                            <span
                              className={`absolute text-[10px] font-semibold ${
                                item.status === 1
                                  ? "left-2 text-white"
                                  : "right-2 text-gray-700"
                              }`}
                            >
                              {item.status === 1 ? "ON" : "OFF"}
                            </span>
                          </button>
                        </TableCell>

                        {/* Action */}

                        <TableCell className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit */}
                            <button
                              onClick={() => openEditModal(item._id)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
                              title="Edit"
                            >
                              <Pencil size={16} strokeWidth={2} />
                            </button>

                            {/* Privileges */}
                            <button
                              onClick={() =>
                                navigate(`/set-privileges/${item._id}`)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-all duration-200 hover:bg-emerald-600 hover:text-white"
                              title="Set Privileges"
                            >
                              <ShieldCheck size={16} strokeWidth={2} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white"
                              title="Delete"
                            >
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-12 text-center text-gray-400"
                      >
                        No Roles Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* ===========================
          Add / Edit Modal
      =========================== */}

          {showModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                {/* Header */}

                <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {editId ? "Edit Role" : "Add New Role"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {editId ? "Update role information" : "Create a new role"}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 transition hover:bg-red-100 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>

                {/* Body */}

                <div className="space-y-5 p-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Role Name
                    </label>

                    <input
                      type="text"
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleChange}
                      placeholder="Enter role name"
                      className={`h-11 w-full rounded-xl border px-4 outline-none transition ${
                        errors.roleName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-brand-500"
                      }`}
                    />

                    {errors.roleName && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.roleName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-brand-700"
                  >
                    {editId ? "Update Role" : "Save Role"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
