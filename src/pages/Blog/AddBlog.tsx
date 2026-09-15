import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";

import { getCategoriesApi } from "../../api/blogCategoryApi";

import { addBlogApi } from "../../api/blogApi";

export default function AddBlog() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    author: "",
    shortDescription: "",
    description: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [mainPreview, setMainPreview] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState("");
  const [date, setFromDate] = useState<Date | null>(null);

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

    setErrors((prev: any) => ({ ...prev, [errorKey]: "" }));
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Blog Title is required";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short Description is required";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }
    if (!date) newErrors.fromDate = "From Date is required";

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!mainImage) {
      newErrors.mainImage = "Main Image is required";
    }

    if (!featuredImage) {
      newErrors.featuredImage = "Featured Image is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("categoryId", formData.categoryId);
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("shortDescription", formData.shortDescription);
      data.append("description", formData.description);
      data.append("author", formData.author);
      data.append("date", date?.toISOString() || "");
      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await addBlogApi(data);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/blog");
        setFormData({
          categoryId: "",
          title: "",
          slug: "",
          author: "",

          shortDescription: "",
          description: "",
        });

        setMainImage(null);
        setFeaturedImage(null);
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
      <PageBreadcrumb pageTitle="Add Blog" />

      <div className="space-y-6">
        <ComponentCard title="Add Blog">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Blog Category
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

                  {/* Title */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Blog Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter blog title"
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
                  {/* Author */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Author
                    </label>

                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter author name"
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.author ? "border-red-500" : ""
                      }`}
                    />

                    {errors.author && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.author}
                      </p>
                    )}
                  </div>

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

                    {errors.date && (
                      <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                    )}
                  </div>

                  {/* Main Image */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Main Image
                    </label>
                    <span className="text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .webp
                    </span>
                    <input
                      className="block w-full rounded-lg border border-gray-300 p-2"
                      type="file"
                      accept=".jpg,.jpeg,.webp"
                      onChange={(e) =>
                        validateImage(
                          e.target.files?.[0] || null,
                          setMainImage,
                          setMainPreview,
                          "mainImage",
                        )
                      }
                    />

                    {mainPreview && (
                      <img
                        src={mainPreview}
                        alt="Preview"
                        className="mt-2 h-24 rounded"
                      />
                    )}

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
                    <input
                      className="block w-full rounded-lg border border-gray-300 p-2"
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
                    />

                    {featuredPreview && (
                      <img
                        src={featuredPreview}
                        alt="Preview"
                        className="mt-2 h-24 rounded"
                      />
                    )}

                    {errors.featuredImage && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.featuredImage}
                      </p>
                    )}
                  </div>

                  {/* Short Description */}
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Short Description
                    </label>

                    <textarea
                      rows={3}
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    {errors.shortDescription && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">
                      Description
                    </label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: val,
                        }))
                      }
                      height={400}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.description}
                      </p>
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
