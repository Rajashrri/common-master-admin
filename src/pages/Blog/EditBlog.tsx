import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import RichTextEditor from "../../components/editor/RichTextEditor";
import DatePicker from "react-datepicker";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { toast } from "react-toastify";

import { getCategoriesApi } from "../../api/blogCategoryApi";

import { getBlogByIdApi, updateBlogApi } from "../../api/blogApi";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    author: "",
    shortDescription: "",
    description: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [date, setFromDate] = useState<Date | null>(null);

  const [oldMainImage, setOldMainImage] = useState("");
  const [oldFeaturedImage, setOldFeaturedImage] = useState("");

  const [mainPreview, setMainPreview] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState("");

  useEffect(() => {
    setMainPreview(oldMainImage);
    setFeaturedPreview(oldFeaturedImage);
  }, [oldMainImage, oldFeaturedImage]);

  const handleImageChange = (e, setFile, setPreview, errorKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/webp"];

    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "Only .jpg, .jpeg and .webp files are allowed",
      }));
      e.target.value = "";
      return;
    }

    setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchBlog();
  }, []);

  const fetchCategories = async () => {
    const response = await getCategoriesApi();

    if (response.data.success) {
      setCategories(response.data.data);
    }
  };

  const fetchBlog = async () => {
    const response = await getBlogByIdApi(id);

    const blog = response.data.data;

    setFormData({
      categoryId: blog.categoryId?._id,
      title: blog.title,
      slug: blog.slug,
      author: blog.author || "",
      shortDescription: blog.shortDescription,
      description: blog.description,
    });
    if (blog.date) {
      setFromDate(new Date(blog.date));
    }
    setOldMainImage(blog.mainImage);
    setOldFeaturedImage(blog.featuredImage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData({
        ...formData,
        title: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      console.log(mainImage);
      console.log(featuredImage);
      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateBlogApi(id, data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/blog");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Blog" />

      <div className="space-y-6">
        <ComponentCard title="Edit Blog">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Blog Category
                    </label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    >
                      <option value="">Select Category</option>

                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Blog Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />
                  </div>

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
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Author
                    </label>

                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                      placeholder="Enter author name"
                    />
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
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Main Image
                    </label>
                    <span className="text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .webp
                    </span>
                    <img
                      src={mainPreview}
                      alt="Main"
                      width={120}
                      className="mb-3 rounded"
                    />

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
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Featured Image
                    </label>
                    <span className="text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .webp
                    </span>

                    <img
                      src={featuredPreview}
                      alt="Main"
                      width={120}
                      className="mb-3 rounded"
                    />

                    <input
                      className="block w-full rounded-lg border border-gray-300 p-2"
                      type="file"
                      accept=".jpg,.jpeg,.webp"
                      onChange={(e) =>
                        handleImageChange(
                          e,
                          setFeaturedImage,
                          setFeaturedPreview,
                          "mainImage",
                        )
                      }
                    />
                  </div>
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
                  </div>

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
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="rounded-lg border px-4 py-3"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-white disabled:opacity-50"
                    >
                      {isSubmitting && (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      )}
                      {isSubmitting ? "Updating..." : "Update Blog"}
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
