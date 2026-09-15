import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import { addClientApi } from "../../api/clienteleApi";
import { useNavigate } from "react-router";

export default function AddClientele() {
  const [clientName, setClientName] = useState("");
  const [clientLogo, setClientLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let err: any = {};

    if (!clientName.trim()) err.clientName = "Client Name is required";
    if (!clientLogo) err.clientLogo = "Client Logo is required";

    setErrors(err);

    if (Object.keys(err).length) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("clientName", clientName);

      if (clientLogo) {
        formData.append("clientLogo", clientLogo);
      }

      const response = await addClientApi(formData);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list-clientele");

        setClientName("");
        setClientLogo(null);
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [preview, setPreview] = useState("");
  return (
    <>
      <PageBreadcrumb pageTitle="Add Client" />

      <div className="space-y-6">
        <ComponentCard title="Add Client">
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
                    <label>Client Logo</label>
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
                            clientLogo:
                              "Only .jpg, .jpeg and .webp files are allowed",
                          }));
                          e.target.value = "";
                          return;
                        }

                        setErrors((prev: any) => ({ ...prev, clientLogo: "" }));
                        setClientLogo(file);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />

                    {preview && (
                      <img
                        src={preview}
                        alt="Logo Preview"
                        className="mt-2 h-24 w-24 rounded border object-cover"
                      />
                    )}
                    {errors.clientLogo && (
                      <p className="text-red-500">{errors.clientLogo}</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-white disabled:opacity-50"
                    >
                      {isSubmitting && (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      )}
                      {isSubmitting ? "Adding..." : "Add"}
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
