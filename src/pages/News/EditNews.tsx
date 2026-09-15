import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";
import DatePicker from "react-datepicker";

import { getNewsCategoriesApi } from "../../api/newsCategoryApi";

import { getNewsByIdApi, updateNewsApi } from "../../api/newsApi";

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    postedBy: "",
    briefIntro: "",
    details: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [date, setFromDate] = useState<Date | null>(null);

  const [oldMainImage, setOldMainImage] = useState("");
  const [oldFeaturedImage, setOldFeaturedImage] = useState("");

  const [mainPreview, setMainPreview] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState("");

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchNews();
  }, []);

  useEffect(() => {
    setMainPreview(oldMainImage);
    setFeaturedPreview(oldFeaturedImage);
  }, [oldMainImage, oldFeaturedImage]);

  // ==========================
  // Get News Categories
  // ==========================

  const fetchCategories = async () => {
    try {
      const response = await getNewsCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Get News By Id
  // ==========================

  const fetchNews = async () => {
    try {
      const response = await getNewsByIdApi(id);

      if (response.data.success) {
        const news = response.data.data;

        setFormData({
          categoryId: news.categoryId?._id || "",
          title: news.title || "",
          slug: news.slug || "",
          postedBy: news.postedBy || "",

          briefIntro: news.shortDescription || "",
          details: news.description || "",
        });
        if (news.date) {
          setFromDate(new Date(news.date));
        }
        setOldMainImage(news.mainImage || "");
        setOldFeaturedImage(news.featuredImage || "");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load News");
    }
  };

  // ==========================
  // Input Change
  // ==========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ==========================
  // Image Change
  // ==========================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (url: string) => void,
    errorKey: string,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/webp"];

    if (!allowed.includes(file.type)) {
      setErrors((prev: any) => ({
        ...prev,
        [errorKey]: "Only .jpg, .jpeg and .webp files are allowed",
      }));

      e.target.value = "";
      return;
    }

    setErrors((prev: any) => ({
      ...prev,
      [errorKey]: "",
    }));

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ==========================
  // Update News
  // ==========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.categoryId) {
      newErrors.categoryId = "News Category is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.postedBy.trim()) {
      newErrors.postedBy = "Posted By is required";
    }

    if (!date) newErrors.date = "Date is required";

    if (!formData.briefIntro.trim()) {
      newErrors.briefIntro = "Brief Intro is required";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Details is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("categoryId", formData.categoryId);
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("postedBy", formData.postedBy);
      data.append("date", date?.toISOString() || "");

      // Backend fields
      data.append("shortDescription", formData.briefIntro);
      data.append("description", formData.details);

      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateNewsApi(id, data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/list-news");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit News" />

      <div className="space-y-6">
        <ComponentCard title="Edit News">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* News Category */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      News Category
                    </label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.categoryId ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Category</option>

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

                  {/* News Title */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      News Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.title ? "border-red-500" : ""
                      }`}
                    />

                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Slug
                    </label>

                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

                  {/* Posted By */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Posted By
                    </label>

                    <input
                      type="text"
                      name="postedBy"
                      value={formData.postedBy}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.postedBy ? "border-red-500" : ""
                      }`}
                    />

                    {errors.postedBy && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.postedBy}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Date
                      <span className="text-red-500">*</span>
                    </label>

                    <DatePicker
                      selected={date}
                      onChange={(date) => {
                        setFromDate(date);
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select Date"
                      className="h-11 w-full rounded-lg border border-gray-300 px-4"
                    />
                  </div>

                  {/* Main Image */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Main Image
                    </label>

                    <span className="text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .webp
                    </span>

                    {mainPreview && (
                      <img
                        src={mainPreview}
                        alt="Main"
                        className="mb-3 h-24 rounded border"
                      />
                    )}

                    <input
                      className="block w-full rounded-lg border border-gray-300 p-2"
                      type="file"
                      accept=".jpg,.jpeg,.webp"
                      onChange={(e) =>
                        handleImageChange(
                          e,
                          setMainImage,
                          setMainPreview,
                          "mainImage",
                        )
                      }
                    />

                    {errors.mainImage && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.mainImage}
                      </p>
                    )}
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Featured Image
                    </label>

                    <span className="text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .webp
                    </span>

                    {featuredPreview && (
                      <img
                        src={featuredPreview}
                        alt="Featured"
                        className="mb-3 h-24 rounded border"
                      />
                    )}

                    <input
                      className="block w-full rounded-lg border border-gray-300 p-2"
                      type="file"
                      accept=".jpg,.jpeg,.webp"
                      onChange={(e) =>
                        handleImageChange(
                          e,
                          setFeaturedImage,
                          setFeaturedPreview,
                          "featuredImage",
                        )
                      }
                    />

                    {errors.featuredImage && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.featuredImage}
                      </p>
                    )}
                  </div>

                  {/* Brief Intro */}
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Brief Intro
                    </label>

                    <textarea
                      rows={4}
                      name="briefIntro"
                      value={formData.briefIntro}
                      onChange={handleChange}
                      placeholder="Enter Brief Intro"
                      className={`w-full rounded-lg border px-4 py-3 ${
                        errors.briefIntro ? "border-red-500" : ""
                      }`}
                    />

                    {errors.briefIntro && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.briefIntro}
                      </p>
                    )}
                  </div>

                  {/* Details */}
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
                      <p className="mt-1 text-sm text-red-500">
                        {errors.details}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="rounded-lg border px-5 py-3"
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

                      {isSubmitting ? "Updating..." : "Update News"}
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
