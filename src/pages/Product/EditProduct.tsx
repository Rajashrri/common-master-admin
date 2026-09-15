import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RichTextEditor from "../../components/editor/RichTextEditor";

import { getProductCategoriesApi } from "../../api/productCategoryApi";
import { getProductSubCategoriesApi } from "../../api/productSubCategoryApi";

import { getProductByIdApi, updateProductApi } from "../../api/productApi";

export default function EditProduct() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [categories, setCategories] = useState<any[]>([]);

  const [allSubCategories, setAllSubCategories] = useState<any[]>([]);

  const [subCategories, setSubCategories] = useState<any[]>([]);

  const [mainImage, setMainImage] = useState<File | null>(null);

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const [mainPreview, setMainPreview] = useState("");

  const [featuredPreview, setFeaturedPreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    productName: "",
    slug: "",
    briefIntro: "",
    details: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (categories.length && allSubCategories.length && id) {
      fetchProduct();
    }
  }, [categories, allSubCategories, id]);

  // ==========================
  // Categories
  // ==========================

  const fetchCategories = async () => {
    try {
      const response = await getProductCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Sub Categories
  // ==========================

  const fetchSubCategories = async () => {
    try {
      const response = await getProductSubCategoriesApi();

      if (response.data.success) {
        setAllSubCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Product Detail
  // ==========================

  const fetchProduct = async () => {
    try {
      const response = await getProductByIdApi(id);

      if (response.data.success) {
        const item = response.data.data;

        setFormData({
          categoryId: item.categoryId?._id,
          subCategoryId: item.subCategoryId?._id,
          productName: item.productName,
          slug: item.slug,
          briefIntro: item.briefIntro,
          details: item.details,
        });

        setMainPreview(item.mainImage);

        setFeaturedPreview(item.featuredImage);

        const filtered = allSubCategories.filter(
          (sub: any) =>
            sub.category?._id === item.categoryId?._id ||
            sub.categoryId === item.categoryId?._id,
        );

        setSubCategories(filtered);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Image Validation
  // ==========================

  const validateImage = (
    file: File | null,
    setImage: any,
    setPreview: any,
    key: string,
  ) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/webp"];

    if (!allowed.includes(file.type)) {
      setErrors((prev: any) => ({
        ...prev,
        [key]: "Only jpg, jpeg and webp allowed",
      }));

      return;
    }

    setErrors((prev: any) => ({
      ...prev,
      [key]: "",
    }));

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        subCategoryId: "",
      }));

      const filtered = allSubCategories.filter(
        (item: any) =>
          item.category?._id === value || item.categoryId === value,
      );

      setSubCategories(filtered);

      return;
    }

    if (name === "productName") {
      setFormData((prev) => ({
        ...prev,
        productName: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Update Product
  // ==========================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.categoryId) {
      newErrors.categoryId = "Product Category is required";
    }

    if (!formData.subCategoryId) {
      newErrors.subCategoryId = "Product Sub Category is required";
    }

    if (!formData.productName.trim()) {
      newErrors.productName = "Product Name is required";
    }

    if (!formData.briefIntro.trim()) {
      newErrors.briefIntro = "Brief Intro is required";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Product Details is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("categoryId", formData.categoryId);
      data.append("subCategoryId", formData.subCategoryId);
      data.append("productName", formData.productName);
      data.append("slug", formData.slug);
      data.append("briefIntro", formData.briefIntro);
      data.append("details", formData.details);

      // Upload only if user selected new image
      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateProductApi(id!, data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-product");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================
  // Return
  // ==========================

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Product" />

      <div className="space-y-6">
        <ComponentCard title="Edit Product">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {" "}
                  {/* Product Category */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Product Category
                    </label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.categoryId ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Product Category</option>

                      {categories.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>
                  {/* Product Sub Category */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Product Sub Category
                    </label>

                    <select
                      name="subCategoryId"
                      value={formData.subCategoryId}
                      onChange={handleChange}
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.subCategoryId ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Product Sub Category</option>

                      {subCategories.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {errors.subCategoryId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.subCategoryId}
                      </p>
                    )}
                  </div>
                  {/* Product Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Product Name
                    </label>

                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="Enter Product Name"
                      className={`h-11 w-full rounded-lg border px-4 ${
                        errors.productName ? "border-red-500" : ""
                      }`}
                    />

                    {errors.productName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.productName}
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
                  {/* Main Image */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Main Image
                    </label>

                    <span className="text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .webp
                    </span>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.webp"
                      className="block w-full rounded-lg border border-gray-300 p-2"
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
                      <div className="mt-3">
                        <img
                          src={mainPreview}
                          alt="Main Preview"
                          className="h-24 w-auto rounded-lg border object-cover"
                        />
                      </div>
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
                      type="file"
                      accept=".jpg,.jpeg,.webp"
                      className="block w-full rounded-lg border border-gray-300 p-2"
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
                      <div className="mt-3">
                        <img
                          src={featuredPreview}
                          alt="Featured Preview"
                          className="h-24 w-auto rounded-lg border object-cover"
                        />
                      </div>
                    )}

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
                        errors.briefIntro ? "border-red-500" : "border-gray-300"
                      }`}
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
                      Product Details
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
                  {/* Submit */}
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
                      className="flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-white disabled:opacity-50"
                    >
                      {isSubmitting && (
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      )}

                      {isSubmitting ? "Updating..." : "Update"}
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
