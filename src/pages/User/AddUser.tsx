import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { addUserApi } from "../../api/userApi";
import { getRolesApi } from "../../api/roleMasterApi";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [roles, setRoles] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getRolesApi();
      setRoles(response.data.data);
    } catch (error) {
      toast.error("Unable to load roles");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let err: any = {};

    if (!name.trim()) err.name = "Name is required";
    if (!email.trim()) err.email = "Email is required";
    if (!password.trim()) err.password = "Password is required";
    if (!role) err.role = "Role is required";

    setErrors(err);

    if (Object.keys(err).length) return;

    try {
      const response = await addUserApi({
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        setName("");
        setEmail("");
        setPassword("");
        setRole("");
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add User" />

      <div className="space-y-6">
        <ComponentCard title="Add User">
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid gap-6">

                  {/* Name */}

                  <div>
                    <label className="mb-2 block">Name</label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}

                  <div>
                    <label className="mb-2 block">Email</label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}

                  <div>
                    <label className="mb-2 block">Password</label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Role */}

                  <div>
                    <label className="mb-2 block">Role</label>

                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="h-11 w-full rounded-lg border px-4"
                    >
                      <option value="">Select Role</option>

                      {roles.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.roleName}
                        </option>
                      ))}
                    </select>

                    {errors.role && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.role}
                      </p>
                    )}
                  </div>

                  {/* Button */}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                      Save
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