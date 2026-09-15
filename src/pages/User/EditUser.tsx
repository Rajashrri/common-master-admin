import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getUserDetailApi,
  updateUserApi,
} from "../../api/userApi";

import { getRolesApi } from "../../api/roleMasterApi";

export default function EditUser() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");

  const [roles, setRoles] = useState<any[]>([]);

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {

    fetchRoles();

    if (id) {

      fetchUser();

    }

  }, [id]);

  const fetchRoles = async () => {

    try {

      const res = await getRolesApi();

      setRoles(res.data.data);

    } catch {

      toast.error("Unable to load roles");

    }

  };

  const fetchUser = async () => {

    try {

      const res = await getUserDetailApi(id!);

      const user = res.data.data;

      setName(user.name);

      setEmail(user.email);

      setRole(user.role?._id || "");

    } catch {

      toast.error("Unable to load user");

    }

  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    let err: any = {};

    if (!name.trim()) err.name = "Name is required";

    if (!email.trim()) err.email = "Email is required";

    if (!role) err.role = "Role is required";

    setErrors(err);

    if (Object.keys(err).length) return;

    try {

      const payload: any = {

        name,

        email,

        role,

      };

      if (password.trim()) {

        payload.password = password;

      }

      const res = await updateUserApi(id!, payload);

      if (res.data.success) {

        toast.success(res.data.message);

        navigate("/list-user");

      }

    } catch (error: any) {

      toast.error(error.response?.data?.message);

    }

  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit User" />

      <div className="space-y-6">

        <ComponentCard title="Edit User">

          <div className="overflow-hidden rounded-xl border bg-white">

            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid gap-6">

                  <div>

                    <label>Name</label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.name && (
                      <p className="text-red-500">
                        {errors.name}
                      </p>
                    )}

                  </div>

                  <div>

                    <label>Email</label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.email && (
                      <p className="text-red-500">
                        {errors.email}
                      </p>
                    )}

                  </div>

                  <div>

                    <label>Password</label>

                    <input
                      type="password"
                      value={password}
                      placeholder="Leave blank if no change"
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="h-11 w-full rounded-lg border px-4"
                    />

                  </div>

                  <div>

                    <label>Role</label>

                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value)
                      }
                      className="h-11 w-full rounded-lg border px-4"
                    >

                      <option value="">
                        Select Role
                      </option>

                      {roles.map((item: any) => (

                        <option
                          key={item._id}
                          value={item._id}
                        >
                          {item.roleName}
                        </option>

                      ))}

                    </select>

                    {errors.role && (
                      <p className="text-red-500">
                        {errors.role}
                      </p>
                    )}

                  </div>

                  <div className="flex justify-end">

                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-5 py-2 text-white"
                    >
                      Update
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </ComponentCard>

      </div>
    </>
  );
}