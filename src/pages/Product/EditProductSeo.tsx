import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { toast } from "react-toastify";

import {
  getProductSeoByIdApi,
  updateProductSeoApi,
} from "../../api/productApi";

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

export default function EditProductSeo() {
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

  useEffect(() => {
    fetchSeo();
  }, [id]);

  const fetchSeo = async () => {
    try {
      if (!id) return;

      const response = await getProductSeoByIdApi(id);

      if (response.data.success) {
        setFormData({
          metaTitle: response.data.data.metaTitle || "",
          metaKeywords: response.data.data.metaKeywords || "",
          metaDescription: response.data.data.metaDescription || "",
          mainImageAlt: response.data.data.mainImageAlt || "",
          featuredImageAlt: response.data.data.featuredImageAlt || "",
          schemaCode: response.data.data.schemaCode || "",
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

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
      if (!id) return;
      console.log("FORM DATA =>", formData);
      const response = await updateProductSeoApi(id, formData);

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
      <PageBreadcrumb pageTitle="Product SEO" />

      <div className="space-y-6">
        <ComponentCard title="Product SEO">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  {" "}
                  {/* Meta Title */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
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
                    <label className="mb-1.5 block text-sm font-medium">
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
                    <label className="mb-1.5 block text-sm font-medium">
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
                    <label className="mb-1.5 block text-sm font-medium">
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
                    <label className="mb-1.5 block text-sm font-medium">
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
                    <label className="mb-1.5 block text-sm font-medium">
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
                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-5 py-3 text-white hover:bg-brand-600"
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
