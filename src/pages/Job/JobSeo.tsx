import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { getJobSeoByIdApi, updateJobSeoApi } from "../../api/jobApi";

type SeoFormType = {
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  featuredImageAlt: string;
  schemaCode: string;
};

type ErrorType = {
  metaTitle: string;
};

export default function JobSeo() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<SeoFormType>({
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    featuredImageAlt: "",
    schemaCode: "",
  });

  const [errors, setErrors] = useState<ErrorType>({
    metaTitle: "",
  });

  useEffect(() => {
    fetchSeo();
  }, [id]);

  // ==========================
  // Fetch SEO
  // ==========================

  const fetchSeo = async () => {
    try {
      const response = await getJobSeoByIdApi(id!);

      if (response.data.success) {
        const seo = response.data.data;

        setFormData({
          metaTitle: seo.metaTitle || "",

          metaKeywords: seo.metaKeywords || "",

          metaDescription: seo.metaDescription || "",

          featuredImageAlt: seo.featuredImageAlt || "",

          schemaCode: seo.schemaCode || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };
  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: ErrorType = {
      metaTitle: "",
    };

    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = "Meta Title is required";
    }

    setErrors(newErrors);

    if (newErrors.metaTitle) return;

    try {
      const response = await updateJobSeoApi(id!, formData);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate(-1);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Job SEO" />

      <div className="space-y-6">
        <ComponentCard title="Job SEO">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {/* Meta Title */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Meta Title
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    />
                  </div>

                  {/* Featured Image Alt */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Featured Image Alt Tag
                    </label>

                    <input
                      type="text"
                      name="featuredImageAlt"
                      value={formData.featuredImageAlt}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border border-gray-300 px-4"
                    />
                  </div>

                  {/* Schema */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Schema Code
                    </label>

                    <textarea
                      rows={10}
                      name="schemaCode"
                      value={formData.schemaCode}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono"
                    />
                  </div>

                  {/* Button */}

                  <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <button
                      type="button"
                      onClick={() => navigate("/list-job")}
                      className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-6 py-3 text-white hover:bg-brand-600"
                    >
                      Update SEO
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
