import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";
import { addTestimonialApi } from "../../api/testimonialApi";
import { useNavigate } from "react-router";

export default function AddTestimonial() {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    briefIntro: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const [preview, setPreview] = useState("");

  const handleSubmit = async (e: any) => {
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

      const response = await addTestimonialApi(data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list-Testimonial");

        setFormData({
          name: "",
          designation: "",
          briefIntro: "",
        });

        setImage(null);
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Testimonial" />

      <div className="space-y-6">
        <ComponentCard title="Add Testimonial">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Name
                    </label>

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

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Designation
                    </label>

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

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Image
                    </label>
                    <span className="text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .webp
                    </span>

                    <input
                      className="block w-full rounded-lg border border-gray-300 p-2"
                      type="file"
                      accept=".jpg,.jpeg,.webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const allowed = ["image/jpeg", "image/webp"];

                        if (!allowed.includes(file.type)) {
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
                        className="mt-2 h-24 rounded"
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

                  {/* Submit */}
                  <div>
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
