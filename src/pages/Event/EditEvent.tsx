import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import RichTextEditor from "../../components/editor/RichTextEditor";
import DatePicker from "react-datepicker";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { getEventByIdApi, updateEventApi } from "../../api/eventApi";

import { getEventCategoriesApi } from "../../api/eventCategoryApi";

interface Category {
  _id: string;
  categoryName: string;
}

export default function EditEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",

    entryFee: "",
    ticketLink: "",
    briefIntro: "",
    details: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);

  const [endDate, setEndDate] = useState<Date | null>(null);

  const [timing, setTiming] = useState<Date | null>(null);
  const [mainPreview, setMainPreview] = useState("");

  const [featuredPreview, setFeaturedPreview] = useState("");

  const [errors, setErrors] = useState<any>({});
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

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await getEventCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" ? { slug: slugify(value) } : {}),
    }));
  };
  
  // ==========================
  // Load Event Details
  // ==========================

  const fetchEvent = async () => {
    try {
      const response = await getEventByIdApi(id!);

      if (response.data.success) {
        const event = response.data.data;

       setFormData({
  categoryId: event.categoryId?._id || "",
  title: event.title || "",
  slug: event.slug || "",
  entryFee: event.entryFee || "",
  ticketLink: event.ticketLink || "",
  briefIntro: event.briefIntro || "",
  details: event.details || "",
});
        setFromDate(event.fromDate ? new Date(event.fromDate) : null);

        setEndDate(event.endDate ? new Date(event.endDate) : null);

        setTiming(event.timing ? new Date(event.timing) : null);
        if (event.mainImage) {
          setMainPreview(event.mainImage);
        }

        if (event.featuredImage) {
          setFeaturedPreview(event.featuredImage);
        }
      }
    } catch (error) {
      toast.error("Unable to load Event");
    }
  };
  // ==========================
  // Validation
  // ==========================

  const validate = () => {
    let err: any = {};

    if (!formData.categoryId) err.categoryId = "Category is required";

    if (!formData.title.trim()) err.title = "Title is required";
    if (!fromDate) err.fromDate = "From Date is required";

    if (!endDate) err.endDate = "End Date is required";

    if (fromDate && endDate && endDate < fromDate) {
      err.endDate = "End Date cannot be earlier than From Date";
    }

    if (!timing) err.timing = "Timing is required";

    if (!formData.entryFee.trim()) err.entryFee = "Entry Fee is required";

    if (!formData.ticketLink.trim()) err.ticketLink = "Ticket Link is required";

    if (!formData.briefIntro.trim()) err.briefIntro = "Brief Intro is required";

    if (!formData.details.trim()) err.details = "Event Details are required";

    setErrors(err);

    return Object.keys(err).length === 0;
  };
  // ==========================
  // Update Event
  // ==========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("categoryId", formData.categoryId);

      data.append("title", formData.title);

      data.append("slug", formData.slug);

      data.append("fromDate", fromDate?.toISOString() || "");

      data.append("endDate", endDate?.toISOString() || "");

      data.append("timing", timing?.toISOString() || "");
      data.append("entryFee", formData.entryFee);

      data.append("ticketLink", formData.ticketLink);

      data.append("briefIntro", formData.briefIntro);

      data.append("details", formData.details);

      // Main Image

      if (mainImage) {
        data.append("mainImage", mainImage);
      }

      // Featured Image

      if (featuredImage) {
        data.append("featuredImage", featuredImage);
      }

      const response = await updateEventApi(id!, data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-event");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <PageBreadcrumb pageTitle="Edit Event" />

      <div className="space-y-6">
        <ComponentCard title="Edit Event">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Event Category <span className="text-red-500">*</span>
                </label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                >
                  <option value="">Select Category</option>

                  {categories.map((item) => (
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
                <label className="mb-2 block text-sm font-medium">
                  Event Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />

                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Slug */}

              <div>
                <label className="mb-2 block text-sm font-medium">Slug</label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>

              {/* From Date */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  From Date
                  <span className="text-red-500">*</span>
                </label>

                <DatePicker
                  selected={fromDate}
                  onChange={(date) => {
                    setFromDate(date);
                    setEndDate(null);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select From Date"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />

                {errors.fromDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.fromDate}</p>
                )}
              </div>

              {/* End Date */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  End Date
                  <span className="text-red-500">*</span>
                </label>

                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={fromDate || undefined}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select End Date"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />

                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>

              {/* Timing */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Timing <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={timing}
                  onChange={(date) => setTiming(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Select Time"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>

              {/* Entry Fee */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Entry Fee <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>

              {/* Ticket Link */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Ticket Link <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="ticketLink"
                  value={formData.ticketLink}
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
                  accept=".jpg,.jpeg,.webp"
                  onChange={(e) =>
                    validateImage(
                      e.target.files?.[0] || null,
                      setMainImage,
                      setMainPreview,
                      "mainImage",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 p-2"
                />

                {mainPreview && (
                  <img src={mainPreview} alt="" className="mt-2 h-24 rounded" />
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
                  accept=".jpg,.jpeg,.webp"
                  onChange={(e) =>
                    validateImage(
                      e.target.files?.[0] || null,
                      setFeaturedImage,
                      setFeaturedPreview,
                      "featuredImage",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 p-2"
                />

                {featuredPreview && (
                  <img
                    src={featuredPreview}
                    alt=""
                    className="mt-2 h-24 rounded"
                  />
                )}
              </div>
              {/* Brief Intro */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Brief Intro <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={4}
                  name="briefIntro"
                  value={formData.briefIntro}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-4"
                />
              </div>

              {/* Event Details */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Event Details <span className="text-red-500">*</span>
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
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/list-event")}
                className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-white disabled:opacity-50"
              >
                {isSubmitting && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
}
