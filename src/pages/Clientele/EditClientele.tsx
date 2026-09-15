import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import { Link } from "react-router";

import { getClientDetailApi, updateClientApi } from "../../api/clienteleApi";

export default function EditClientele() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");

  const [logo, setLogo] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    const response = await getClientDetailApi(id!);

    if (response.data.success) {
      setClientName(response.data.data.clientName);

      setPreview(response.data.data.clientLogo);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let err: any = {};

    if (!clientName.trim()) {
      err.clientName = "Client Name is required";
    }

    setErrors(err);

    if (Object.keys(err).length) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("clientName", clientName);

      if (logo) {
        formData.append("clientLogo", logo);
      }

      const response = await updateClientApi(id!, formData);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-clientele");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Client" />

      <div className="space-y-6">
        <ComponentCard title="Edit Client">
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div>
                    <label>Client Name</label>

                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.clientName && (
                      <p className="text-red-500">{errors.clientName}</p>
                    )}
                  </div>

                  <div>
                    <label>Current Logo</label>

                    {preview && (
                      <img
                        src={preview}
                        className="mt-2 h-24 w-24 rounded border object-cover"
                      />
                    )}
                  </div>

                  <div>
                    <label> Logo</label>

                    <p className="mt-1 text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .webp
                    </p>

                    <input
                      className="block w-full rounded-lg border border-gray-300 p-2"
                      type="file"
                      accept=".jpg,.jpeg,.webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (!["image/jpeg", "image/webp"].includes(file.type)) {
                          setErrors((prev: any) => ({
                            ...prev,
                            logo: "Only .jpg, .jpeg and .webp files are allowed",
                          }));
                          e.target.value = "";
                          return;
                        }

                        setErrors((prev: any) => ({ ...prev, logo: "" }));
                        setLogo(file);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                    {errors.logo && (
                      <p className="text-red-500">{errors.logo}</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Link
                      to="/list-clientele"
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Back
                    </Link>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-white disabled:opacity-50"
                    >
                      {isSubmitting && (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      )}
                      {isSubmitting ? "Updating..." : "Update"}
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
