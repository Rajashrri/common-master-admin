import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { getProjectSeoApi, updateProjectSeoApi } from "../../api/projectApi";

type SeoFormType = {
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  mainImageAlt: string;
  featuredImageAlt: string;
  schemaCode: string;
};

type ErrorType = {
  metaTitle: string;
};

const ProjectSeo = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState<SeoFormType>({
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    mainImageAlt: "",
    featuredImageAlt: "",
    schemaCode: "",
  });

  const [errors, setErrors] = useState<ErrorType>({
    metaTitle: "",
  });

  const [loading, setLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    try {
      setLoading(true);

      const response = await getProjectSeoApi(id!);

      if (response.data.success) {
        const seo = response.data.data;

        setFormData({
          metaTitle: seo.metaTitle || "",

          metaKeywords: seo.metaKeywords || "",

          metaDescription: seo.metaDescription || "",

          mainImageAlt: seo.mainImageAlt || "",

          featuredImageAlt: seo.featuredImageAlt || "",

          schemaCode: seo.schemaCode || "",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load SEO data");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err: ErrorType = {
      metaTitle: "",
    };

    if (!formData.metaTitle.trim()) {
      err.metaTitle = "Meta Title Required";
    }

    setErrors(err);

    if (err.metaTitle) return;

    try {
      setIsSubmitting(true);

      const response = await updateProjectSeoApi(id!, formData);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-project");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Project SEO" />

      <div className="space-y-6">
        <ComponentCard title="Project SEO">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              {loading ? (
                <div className="py-10 text-center">Loading...</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    {/* Meta Title */}

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Meta Title
                      </label>

                      <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        className={`h-11 w-full rounded-lg border px-4 ${
                          errors.metaTitle ? "border-red-500" : ""
                        }`}
                      />

                      {errors.metaTitle && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.metaTitle}
                        </p>
                      )}
                    </div>

                    {/* Meta Keywords */}

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Meta Keywords
                      </label>

                      <textarea
                        rows={3}
                        name="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-3"
                      />
                    </div>
                    {/* Meta Description */}

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Meta Description
                      </label>

                      <textarea
                        rows={4}
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-3"
                      />
                    </div>

                    {/* Main Image Alt */}

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Main Image Alt
                      </label>

                      <input
                        type="text"
                        name="mainImageAlt"
                        value={formData.mainImageAlt}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border px-4"
                      />
                    </div>

                    {/* Featured Image Alt */}

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Featured Image Alt
                      </label>

                      <input
                        type="text"
                        name="featuredImageAlt"
                        value={formData.featuredImageAlt}
                        onChange={handleChange}
                        className="h-11 w-full rounded-lg border px-4"
                      />
                    </div>

                    {/* Schema Code */}

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Schema Code
                      </label>

                      <textarea
                        rows={10}
                        name="schemaCode"
                        value={formData.schemaCode}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-3 font-mono"
                      />
                    </div>
                    {/* Buttons */}

                    <div className="flex justify-end gap-3 border-t pt-6">
                      <button
                        type="button"
                        onClick={() => navigate("/list-project")}
                        className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-brand-500 px-6 py-2 text-white disabled:opacity-50"
                      >
                        {isSubmitting ? "Updating..." : "Update SEO"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default ProjectSeo;
