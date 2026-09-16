import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RichTextEditor from "../../components/editor/RichTextEditor";

import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { getServiceByIdApi, updateServiceApi } from "../../api/serviceApi";

import { getServiceCategoriesApi } from "../../api/serviceCategoryApi";

export default function EditService() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

interface ServiceFormData {
    categoryId: string;
    serviceName: string;
    mainImage: string;
        slug: string;

    featuredImage: string;
    briefIntro: string;
    details: string;
}

const [formData, setFormData] = useState<ServiceFormData>({
    categoryId: "",
    serviceName: "",
      slug: "",
    mainImage: "",
    featuredImage: "",
    briefIntro: "",
    details: "",
});
  const validateImage = (
    file: File | null,
    setImage: (f: File | null) => void,
    setPreview: (url: string) => void,
    errorKey: string,
  ) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/webp"];

    if (!allowed.includes(file.type)) {
      setErrors((prev: any) => ({
        ...prev,
        [errorKey]: "Only .jpg, .jpeg and .webp files are allowed",
      }));

      setImage(null);
      setPreview("");
      return;
    }

    setErrors((prev: any) => ({
      ...prev,
      [errorKey]: "",
    }));

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const [mainImage, setMainImage] = useState<File | null>(null);

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const [mainPreview, setMainPreview] = useState("");

  const [featuredPreview, setFeaturedPreview] = useState("");

  const [errors, setErrors] = useState({
    categoryId: "",
    serviceName: "",
  });

  useEffect(() => {
    fetchCategories();

    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await getServiceCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchService = async () => {
    try {
      if (!id) return;

      const response = await getServiceByIdApi(id);

      if (response.data.success) {
        const item = response.data.data;

        setFormData({
          categoryId: item.categoryId?._id,
          serviceName: item.serviceName,
          slug: item.slug,
          briefIntro: item.briefIntro,
          details: item.details,
        });

        setMainPreview(item.mainImage);

        setFeaturedPreview(item.featuredImage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "serviceName") {
      setFormData({
        ...formData,
        serviceName: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      });

      setErrors({
        ...errors,
        serviceName: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      if (name === "categoryId") {
        setErrors({
          ...errors,
          categoryId: "",
          serviceName: errors.serviceName,
        });
      }
    }
  };

  // ==========================
  // Main Image
  // ==========================

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMainImage(file);

    setMainPreview(URL.createObjectURL(file));
  };

  // ==========================
  // Featured Image
  // ==========================

  const handleFeaturedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFeaturedImage(file);

    setFeaturedPreview(URL.createObjectURL(file));
  };

  // ==========================
  // Update Service
  // ==========================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      categoryId: "",
      serviceName: "",
      briefIntro: "",
      details: "",
      mainImage: "",
      featuredImage: "",
    };

    if (!formData.categoryId) {
      newErrors.categoryId = "Service Category is required";
    }

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Service Name is required";
    }

    if (!formData.briefIntro.trim()) {
      newErrors.briefIntro = "Brief Intro is required";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Details is required";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) {
      return;
    }
    setIsSubmitting(true);

    try {
      if (!id) return;

      const data = new FormData();

      data.append("categoryId", formData.categoryId);

      data.append("serviceName", formData.serviceName);

      data.append("slug", formData.slug);

      data.append("briefIntro", formData.briefIntro);

      data.append("details", formData.details);

      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateServiceApi(id, data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-service");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Service" />

      <div className="space-y-6">
        <ComponentCard title="Edit Service">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Service Category */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Service Category
                </label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`h-11 w-full rounded-lg border px-4 ${
                    errors.categoryId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Service Category</option>

                  {categories.map((item: any) => (
                    <option key={item._id} value={item._id}>
                      {item.categoryName}
                    </option>
                  ))}
                </select>

                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Service Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Service Name
                </label>

                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder="Enter Service Name"
                  className={`h-11 w-full rounded-lg border px-4 ${
                    errors.serviceName ? "border-red-500" : "border-gray-300"
                  }`}
                />

                {errors.serviceName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.serviceName}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Slug</label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>

              {/* Main Image */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Main Image
                </label>
                <span className="text-sm text-red-500">
                  Allowed: .jpg, .jpeg, .webp
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    validateImage(
                      e.target.files?.[0] || null,
                      setMainImage,
                      setMainPreview,
                      "mainImage",
                    )
                  }
                  className="block w-full rounded-lg border border-gray-300 p-2"
                />
                {errors.mainImage && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mainImage}
                  </p>
                )}
                {mainPreview && (
                  <img
                    src={mainPreview}
                    alt="Main Preview"
                    className="mt-3 h-28 w-28 rounded-lg border object-cover"
                  />
                )}
              </div>

              {/* Featured Image */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Featured Image
                </label>
                <span className="text-sm text-red-500">
                  Allowed: .jpg, .jpeg, .webp
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    validateImage(
                      e.target.files?.[0] || null,
                      setFeaturedImage,
                      setFeaturedPreview,
                      "featuredImage",
                    )
                  }
                  className="block w-full rounded-lg border border-gray-300 p-2"
                />
                {errors.featuredImage && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.featuredImage}
                  </p>
                )}
                {featuredPreview && (
                  <img
                    src={featuredPreview}
                    alt="Featured Preview"
                    className="mt-3 h-28 w-28 rounded-lg border object-cover"
                  />
                )}
              </div>
              {/* Brief Intro */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Brief Intro
                </label>

                <textarea
                  name="briefIntro"
                  rows={4}
                  value={formData.briefIntro}
                  onChange={handleChange}
                  placeholder="Enter Brief Intro"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
                {errors.briefIntro && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.briefIntro}
                  </p>
                )}
              </div>

              {/* Product Details */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">
                  Details
                </label>

                <RichTextEditor
                  value={formData.details}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      details: value,
                    }))
                  }
                  height={400}
                />

                {errors.details && (
                  <p className="mt-1 text-sm text-red-500">{errors.details}</p>
                )}
              </div>
              {/* Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center rounded-lg bg-brand-500 px-6 py-2 text-white disabled:opacity-50"
                >
                  {isSubmitting && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  )}

                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
}
