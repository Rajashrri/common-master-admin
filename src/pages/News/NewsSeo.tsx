import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getNewsSeoByIdApi,
  updateNewsSeoApi,
} from "../../api/newsApi";

export default function NewsSeo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    mainImageAlt: "",
    featuredImageAlt: "",
    schemaCode: "",
  });

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    try {
      const response = await getNewsSeoByIdApi(id);

      if (response.data.success) {
        const data = response.data.data;

        setFormData({
          metaTitle: data.metaTitle || "",
          metaKeywords: data.metaKeywords || "",
          metaDescription: data.metaDescription || "",
          mainImageAlt: data.mainImageAlt || "",
          featuredImageAlt: data.featuredImageAlt || "",
          schemaCode: data.schemaCode || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await updateNewsSeoApi(id, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list-news");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="News SEO" />

      <div className="space-y-6">
        <ComponentCard title="News SEO">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Meta Title */}
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Meta Title
                    </label>

                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      placeholder="Enter Meta Title"
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  {/* Meta Keywords */}
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Meta Keywords
                    </label>

                    <textarea
                      rows={3}
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleChange}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Meta Description
                    </label>

                    <textarea
                      rows={4}
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      placeholder="Enter Meta Description"
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>

                                    {/* Main Image Alt */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Main Image Alt
                    </label>

                    <input
                      type="text"
                      name="mainImageAlt"
                      value={formData.mainImageAlt}
                      onChange={handleChange}
                      placeholder="Enter Main Image Alt"
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  {/* Featured Image Alt */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Featured Image Alt
                    </label>

                    <input
                      type="text"
                      name="featuredImageAlt"
                      value={formData.featuredImageAlt}
                      onChange={handleChange}
                      placeholder="Enter Featured Image Alt"
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  {/* Schema Code */}
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Schema Code
                    </label>

                    <textarea
                      rows={10}
                      name="schemaCode"
                      value={formData.schemaCode}
                      onChange={handleChange}
                      placeholder="Paste JSON-LD Schema Code"
                      className="w-full rounded-lg border px-4 py-3 font-mono text-sm"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="md:col-span-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="rounded-lg border border-gray-300 px-5 py-3 hover:bg-gray-100"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-white disabled:opacity-50"
                    >
                      {isSubmitting && (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      )}

                      {isSubmitting ? "Updating..." : "Update SEO"}
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