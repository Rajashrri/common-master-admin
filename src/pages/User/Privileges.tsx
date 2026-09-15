import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
  getRoleDetailApi,
} from "../../api/roleMasterApi";

import {
  getPrivilegeDetailApi,
  savePrivilegeApi,
} from "../../api/privilegeApi";

interface Permission {
  resource: string;
  operations: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export default function RolePrivileges() {
  const { roleId } = useParams();

  const [roleName, setRoleName] = useState("");

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      resource: "blog",
      operations: {
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
    },
    {
      resource: "team",
      operations: {
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
    },
    {
      resource: "testimonial",
      operations: {
        view: false,
        add: false,
        edit: false,
        delete: false,
      },
    },
  ]);

  useEffect(() => {
    if (roleId) {
      fetchRole();
      fetchPrivilege();
    }
  }, [roleId]);

  // ================= ROLE =================

  const fetchRole = async () => {
    try {
      const response = await getRoleDetailApi(roleId!);

      if (response.data.success) {
        setRoleName(response.data.data.roleName);
      }
    } catch (error) {
      toast.error("Unable to load role.");
    }
  };

  // ================= PRIVILEGES =================

  const fetchPrivilege = async () => {
    try {
      const response = await getPrivilegeDetailApi(roleId!);

      if (
        response.data.success &&
        response.data.data?.permissions?.length
      ) {
        setPermissions(response.data.data.permissions);
      }
    } catch (error) {
      toast.error("Unable to load privileges.");
    }
  };

  // ================= SINGLE CHECK =================

  const handlePermissionChange = (
    resource: string,
    operation: "view" | "add" | "edit" | "delete"
  ) => {
    setPermissions((prev) =>
      prev.map((item) => {
        if (item.resource !== resource) return item;

        return {
          ...item,
          operations: {
            ...item.operations,
            [operation]: !item.operations[operation],
          },
        };
      })
    );
  };

  // ================= CHECK ALL =================

  const handleCheckAll = (resource: string) => {
    setPermissions((prev) =>
      prev.map((item) => {
        if (item.resource !== resource) return item;

        const allChecked = Object.values(
          item.operations
        ).every(Boolean);

        return {
          ...item,
          operations: {
            view: !allChecked,
            add: !allChecked,
            edit: !allChecked,
            delete: !allChecked,
          },
        };
      })
    );
  };

  // ================= SAVE =================

  const handleSubmit = async () => {
    try {
      const response = await savePrivilegeApi({
        roleId,
        permissions,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save privileges."
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Role Privileges" />

      <div className="space-y-6">
        <ComponentCard title="Role Privileges">

          {/* Selected Role */}

          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Selected Role
            </label>

            <input
              type="text"
              value={roleName}
              readOnly
              className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 font-medium text-gray-700 shadow-sm"
            />
          </div>

          {/* Permission Table */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">

            <Table>

              <TableHeader className="bg-gradient-to-r from-slate-800 to-slate-700">

                <TableRow>

                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-white"
                  >
                    Resource
                  </TableCell>

                  <TableCell
                    isHeader
                    className="text-center font-semibold text-white"
                  >
                    All
                  </TableCell>

                  <TableCell
                    isHeader
                    className="text-center font-semibold text-white"
                  >
                    View
                  </TableCell>

                  <TableCell
                    isHeader
                    className="text-center font-semibold text-white"
                  >
                    Add
                  </TableCell>

                  <TableCell
                    isHeader
                    className="text-center font-semibold text-white"
                  >
                    Edit
                  </TableCell>

                  <TableCell
                    isHeader
                    className="text-center font-semibold text-white"
                  >
                    Delete
                  </TableCell>

                </TableRow>

              </TableHeader>

              <TableBody>
                                {permissions.map((item, index) => (

                  <TableRow
                    key={index}
                    className="border-b border-gray-100 transition hover:bg-blue-50"
                  >

                    {/* Resource */}

                    <TableCell className="px-6 py-5">

                      <span className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold capitalize text-indigo-700">
                        {item.resource}
                      </span>

                    </TableCell>

                    {/* All */}

                    <TableCell className="text-center">

                      <input
                        type="checkbox"
                        checked={Object.values(item.operations).every(Boolean)}
                        onChange={() =>
                          handleCheckAll(item.resource)
                        }
                        className="h-5 w-5 cursor-pointer accent-green-600"
                      />

                    </TableCell>

                    {/* View */}

                    <TableCell className="text-center">

                      <input
                        type="checkbox"
                        checked={item.operations.view}
                        onChange={() =>
                          handlePermissionChange(
                            item.resource,
                            "view"
                          )
                        }
                        className="h-5 w-5 cursor-pointer accent-blue-600"
                      />

                    </TableCell>

                    {/* Add */}

                    <TableCell className="text-center">

                      <input
                        type="checkbox"
                        checked={item.operations.add}
                        onChange={() =>
                          handlePermissionChange(
                            item.resource,
                            "add"
                          )
                        }
                        className="h-5 w-5 cursor-pointer accent-green-600"
                      />

                    </TableCell>

                    {/* Edit */}

                    <TableCell className="text-center">

                      <input
                        type="checkbox"
                        checked={item.operations.edit}
                        onChange={() =>
                          handlePermissionChange(
                            item.resource,
                            "edit"
                          )
                        }
                        className="h-5 w-5 cursor-pointer accent-yellow-500"
                      />

                    </TableCell>

                    {/* Delete */}

                    <TableCell className="text-center">

                      <input
                        type="checkbox"
                        checked={item.operations.delete}
                        onChange={() =>
                          handlePermissionChange(
                            item.resource,
                            "delete"
                          )
                        }
                        className="h-5 w-5 cursor-pointer accent-red-600"
                      />

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>

          {/* Bottom Buttons */}

          <div className="mt-8 flex justify-end gap-3">

            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600"
            >
              Save Privileges
            </button>

          </div>

        </ComponentCard>

      </div>

    </>

  );

}