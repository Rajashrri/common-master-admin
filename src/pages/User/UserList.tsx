import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import Badge from "../../components/ui/badge/Badge";

import {
  getUserListApi,
  deleteUserApi,
  changeUserStatusApi,
} from "../../api/userApi";

interface User {
  _id: string;
  name: string;
  email: string;
  roleName: string;
  isActive: boolean;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getUserListApi();

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteUserApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const response = await changeUserStatusApi(id);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="User List" />

      <div className="space-y-6">
        <ComponentCard title="User Management">
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
                      Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-sm font-semibold text-white"
                    >
                      Email
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-6 py-4 text-center text-sm font-semibold text-white"
                    >
                      Role
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
                        colSpan={6}
                        className="py-12 text-center text-gray-500"
                      >
                        Loading Users...
                      </TableCell>
                    </TableRow>
                  ) : users.length ? (
                    users.map((item, index) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 h-20"
                      >
                        {/* Sr */}

                        <TableCell className="text-center font-semibold text-gray-600">
                          {index + 1}
                        </TableCell>

                        {/* Name */}

                        <TableCell>
                          <div className="font-semibold text-gray-800">
                            {item.name}
                          </div>
                        </TableCell>

                        {/* Email */}

                        <TableCell>
                          <span className="text-gray-500">{item.email}</span>
                        </TableCell>

                        {/* Role */}

                        <TableCell className="py-5 text-center align-middle">
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {item.roleName}
                          </span>
                        </TableCell>

                        {/* Status */}

                        <TableCell className="py-5 text-center align-middle">
                          <button
                            onClick={() => handleStatus(item._id)}
                            className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none"
                            style={{
                              backgroundColor: item.isActive
                                ? "#22c55e"
                                : "#d1d5db",
                            }}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                                item.isActive
                                  ? "translate-x-8"
                                  : "translate-x-1"
                              }`}
                            />

                            <span
                              className={`absolute text-[10px] font-semibold ${
                                item.isActive
                                  ? "left-2 text-white"
                                  : "right-2 text-gray-700"
                              }`}
                            >
                              {item.isActive ? "ON" : "OFF"}
                            </span>
                          </button>
                        </TableCell>

                        {/* Action */}

                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit */}
                            <Link
                              to={`/edit-user/${item._id}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
                              title="Edit"
                            >
                              <Pencil size={16} strokeWidth={2} />
                            </Link>

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
                        colSpan={6}
                        className="py-12 text-center text-gray-400"
                      >
                        No Users Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
