import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";

import { toast } from "react-toastify";

import { getCategoriesApi } from "../../api/projectCategoryApi";

import { getProjectByIdApi, updateProjectApi } from "../../api/projectApi";

const EditProject = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    slug: "",
    briefIntro: "",
    details: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const [oldMainImage, setOldMainImage] = useState("");

  const [oldFeaturedImage, setOldFeaturedImage] = useState("");

  const [mainPreview, setMainPreview] = useState("");

  const [featuredPreview, setFeaturedPreview] = useState("");

  const [errors, setErrors] = useState<any>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    fetchCategories();
    fetchProject();
  }, []);

  useEffect(() => {
    setMainPreview(oldMainImage);
    setFeaturedPreview(oldFeaturedImage);
  }, [oldMainImage, oldFeaturedImage]);

  // ==========================
  // Get Categories
  // ==========================

  useEffect(() => {
    setMainPreview(oldMainImage);
    setFeaturedPreview(oldFeaturedImage);
  }, [oldMainImage, oldFeaturedImage]);

  // ==========================
  // Get Categories
  // ==========================

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  // ==========================
  // Get Project Details
  // ==========================

  const fetchProject = async () => {
    try {
      const response = await getProjectByIdApi(id!);

      if (response.data.success) {
        const project = response.data.data;

        setFormData({
          categoryId: project.categoryId?._id || "",
          name: project.name || "",
          slug: project.slug || "",
          briefIntro: project.briefIntro || "",
          details: project.details || "",
        });

        setOldMainImage(project.mainImage || "");
        setOldFeaturedImage(project.featuredImage || "");
      }
    } catch (error) {
      toast.error("Failed to load project");
    }
  };
  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
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

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ==========================
  // Image Validation
  // ==========================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: any,
    setPreview: any,
    errorKey: string,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev: any) => ({
        ...prev,
        [errorKey]: "Only JPG, JPEG and WEBP files are allowed.",
      }));

      return;
    }

    setErrors((prev: any) => ({
      ...prev,
      [errorKey]: "",
    }));

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ==========================
  // Validation
  // ==========================

  const validate = () => {
    const err: any = {};

    if (!formData.categoryId) {
      err.categoryId = "Category is required";
    }

    if (!formData.name.trim()) {
      err.name = "Project name is required";
    }

    if (!formData.briefIntro.trim()) {
      err.briefIntro = "Brief intro is required";
    }

    if (!formData.details.trim()) {
      err.details = "Details are required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };
  // ==========================
  // Update Project
  // ==========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("categoryId", formData.categoryId);

      data.append("name", formData.name);

      data.append("slug", formData.slug);

      data.append("briefIntro", formData.briefIntro);

      data.append("details", formData.details);

      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateProjectApi(id!, data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-project");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Edit Project" />

      <div className="space-y-6">
        <ComponentCard title="Edit Project">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Project Category
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

              {/* Project Name */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Project Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`h-11 w-full rounded-lg border px-4 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
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
                  className="h-11 w-full rounded-lg border px-4"
                />
              </div>

              {/* Main Image */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Main Image
                </label>

                {mainPreview && (
                  <img
                    src={mainPreview}
                    alt="Main"
                    className="mb-3 h-28 w-40 rounded-lg border object-cover"
                  />
                )}

                <span className="text-sm text-red-500">
                  Allowed : JPG, JPEG, WEBP
                </span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.webp"
                  className="mt-2 block w-full rounded-lg border border-gray-300 p-2"
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
                <label className="mb-2 block text-sm font-medium">
                  Featured Image
                </label>

                {featuredPreview && (
                  <img
                    src={featuredPreview}
                    alt="Featured"
                    className="mb-3 h-28 w-40 rounded-lg border object-cover"
                  />
                )}

                <span className="text-sm text-red-500">
                  Allowed : JPG, JPEG, WEBP
                </span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.webp"
                  className="mt-2 block w-full rounded-lg border border-gray-300 p-2"
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
                <label className="mb-2 block text-sm font-medium">
                  Brief Intro
                </label>

                <textarea
                  rows={4}
                  name="briefIntro"
                  value={formData.briefIntro}
                  onChange={handleChange}
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
                <label className="mb-2 block text-sm font-medium">
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

              <div className="md:col-span-2 flex justify-end gap-3 border-t pt-6">
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
                  {isSubmitting ? "Updating..." : "Update Project"}
                </button>
              </div>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default EditProject;
