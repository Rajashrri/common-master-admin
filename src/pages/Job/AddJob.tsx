import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import RichTextEditor from "../../components/editor/RichTextEditor";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { addJobApi } from "../../api/jobApi";
import { getJobCategoriesApi } from "../../api/jobCategoryApi";

interface Category {
  _id: string;
  categoryName: string;
}

export default function AddJob() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    designation: "",
    salaryOffered: "",
    experience: "",
    briefIntro: "",
    details: "",
  });

  const [featuredImage, setFeaturedImage] =
    useState<File | null>(null);

  const [featuredPreview, setFeaturedPreview] =
    useState("");

  const [errors, setErrors] = useState<any>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // ==========================
  // Load Categories
  // ==========================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response =
        await getJobCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Slug
  // ==========================

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ==========================
  // Input Change
  // ==========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "title"
        ? {
            slug: slugify(value),
          }
        : {}),
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================
  // Image
  // ==========================

  const validateImage = (
    file: File | null
  ) => {

    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {

      setErrors((prev: any) => ({
        ...prev,
        featuredImage:
          "Only .jpg, .jpeg and .webp allowed",
      }));

      return;
    }

    setErrors((prev: any) => ({
      ...prev,
      featuredImage: "",
    }));

    setFeaturedImage(file);

    setFeaturedPreview(
      URL.createObjectURL(file)
    );
  };
  // ==========================
// Validation
// ==========================

const validate = () => {
  let err: any = {};

  if (!formData.categoryId)
    err.categoryId = "Job Category is required";

  if (!formData.title.trim())
    err.title = "Job Title is required";

  if (!formData.designation.trim())
    err.designation = "Designation is required";

  if (!formData.salaryOffered.trim())
    err.salaryOffered = "Salary Offered is required";

  if (!formData.experience.trim())
    err.experience = "Experience is required";

  if (!formData.briefIntro.trim())
    err.briefIntro = "Brief Intro is required";

  if (!formData.details.trim())
    err.details = "Job Details is required";

  if (!featuredImage)
    err.featuredImage = "Featured Image is required";

  setErrors(err);

  return Object.keys(err).length === 0;
};

// ==========================
// Submit
// ==========================

const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  if (!validate()) return;

  setIsSubmitting(true);

  try {
    const data = new FormData();

    data.append(
      "categoryId",
      formData.categoryId
    );

    data.append(
      "title",
      formData.title
    );

    data.append(
      "slug",
      formData.slug
    );

    data.append(
      "designation",
      formData.designation
    );

    data.append(
      "salaryOffered",
      formData.salaryOffered
    );

    data.append(
      "experience",
      formData.experience
    );

    data.append(
      "briefIntro",
      formData.briefIntro
    );

    data.append(
      "details",
      formData.details
    );

    if (featuredImage) {
      data.append(
        "featuredImage",
        featuredImage
      );
    }

    const response =
      await addJobApi(data);

    if (response.data.success) {

      toast.success(
        response.data.message
      );

      navigate("/list-job");
    }

  } catch (error: any) {

    toast.error(
      error.response?.data?.message ||
      "Something went wrong"
    );

  } finally {

    setIsSubmitting(false);

  }
};
return (
  <>
    <PageBreadcrumb pageTitle="Add Job" />

    <div className="space-y-6">
      <ComponentCard title="Add Job">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Job Category */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Job Category
                <span className="text-red-500">*</span>
              </label>

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 px-4"
              >
                <option value="">
                  Select Job Category
                </option>

                {categories.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
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
              <label className="mb-2 block text-sm font-medium">
                Job Title
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 px-4"
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Slug */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Slug
              </label>

              <input
                type="text"
                name="slug"
                value={formData.slug}
                
className="h-11 w-full rounded-lg border border-gray-300 px-4"              />
            </div>

            {/* Designation */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Designation
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 px-4"
              />

              {errors.designation && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.designation}
                </p>
              )}
            </div>

            {/* Salary Offered */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Salary Offered
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="salaryOffered"
                value={formData.salaryOffered}
                onChange={handleChange}
                placeholder="₹30,000 - ₹45,000"
                className="h-11 w-full rounded-lg border border-gray-300 px-4"
              />

              {errors.salaryOffered && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.salaryOffered}
                </p>
              )}
            </div>

            {/* Experience */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Experience
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="2-5 Years"
                className="h-11 w-full rounded-lg border border-gray-300 px-4"
              />

              {errors.experience && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.experience}
                </p>
              )}
            </div>
                        {/* Featured Image */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Featured Image
                <span className="text-red-500">*</span>
              </label>

              <span className="mb-2 block text-xs text-red-500">
                Allowed: .jpg, .jpeg, .webp
              </span>

              <input
                type="file"
                accept=".jpg,.jpeg,.webp"
                onChange={(e) =>
                  validateImage(
                    e.target.files?.[0] || null
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-2"
              />

              {errors.featuredImage && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.featuredImage}
                </p>
              )}

              {featuredPreview && (
                <img
                  src={featuredPreview}
                  alt=""
                  className="mt-3 h-28 rounded-lg border"
                />
              )}
            </div>

            {/* Brief Intro */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Brief Intro
                <span className="text-red-500">*</span>
              </label>

              <textarea
                rows={4}
                name="briefIntro"
                value={formData.briefIntro}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-4"
              />

              {errors.briefIntro && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.briefIntro}
                </p>
              )}
            </div>

            {/* Job Details */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Job Details
                <span className="text-red-500">*</span>
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
                <p className="mt-2 text-sm text-red-500">
                  {errors.details}
                </p>
              )}
            </div>

          </div>

          {/* Buttons */}

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
              disabled={isSubmitting}
              className="flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-white disabled:opacity-50"
            >
              {isSubmitting && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              )}

              {isSubmitting
                ? "Saving..."
                : "Save Job"}
            </button>

          </div>

        </form>
      </ComponentCard>
    </div>
  </>
);
}