import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { addCoreTeamApi } from "../../api/coreTeamApi";

export default function AddCoreTeam() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    briefIntro: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});

const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.name.trim()) err.name = "Name is required";

    if (!formData.designation.trim())
      err.designation = "Designation is required";
    if (!formData.briefIntro.trim()) err.briefIntro = "Brief Intro is required";

    if (!image) err.image = "Image is required";

    setErrors(err);

    if (Object.keys(err).length > 0) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("briefIntro", formData.briefIntro);

      if (image) {
        data.append("image", image);
      }

      const response = await addCoreTeamApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-team");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally {
      setIsSubmitting(false);
    }
  };
  const [preview, setPreview] = useState("");
  return (
    <>
      <PageBreadcrumb pageTitle="Add Team" />

      <div className="space-y-6">
        <ComponentCard title="Add Team">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {/* Name */}

                  <div>
                    <label className="mb-2 block">Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.name && (
                      <p className="text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Designation */}

                  <div>
                    <label className="mb-2 block">Designation</label>

                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.designation && (
                      <p className="text-red-500">{errors.designation}</p>
                    )}
                  </div>

                  {/* Image */}

                  <div>
                    <label className="mb-2 block">Image</label>
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
                            image:
                              "Only .jpg, .jpeg and .webp files are allowed",
                          }));
                          e.target.value = "";
                          return;
                        }

                        setErrors((prev: any) => ({ ...prev, image: "" }));
                        setImage(file);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="mt-2 h-24 w-24 rounded object-cover"
                      />
                    )}

                    {errors.image && (
                      <p className="text-red-500">{errors.image}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Brief Intro
                    </label>

                    <textarea
                      rows={5}
                      name="briefIntro"
                      value={formData.briefIntro}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    {errors.briefIntro && (
                      <p className="text-red-500">{errors.briefIntro}</p>
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
