import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { getCategoriesApi } from "../../api/videoCategoryApi";

import {
  getVideoByIdApi,
  updateVideoApi,
} from "../../api/videoApi";

interface Category {
  _id: string;
  categoryName: string;
}

export default function EditVideo() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    youtubeLink: "",
    briefIntro: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [oldThumbnail, setOldThumbnail] = useState("");

  const [errors, setErrors] = useState<any>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchVideo();
  }, []);

  useEffect(() => {
    setThumbnailPreview(oldThumbnail);
  }, [oldThumbnail]);

  const fetchCategories = async () => {
    const response = await getCategoriesApi();

    if (response.data.success) {
      setCategories(response.data.data);
    }
  };

  const fetchVideo = async () => {
    const response = await getVideoByIdApi(id);

    if (response.data.success) {
      const video = response.data.data;

      setFormData({
        categoryId: video.categoryId?._id,
        title: video.title,
        slug: video.slug,
        youtubeLink: video.youtubeLink,
        briefIntro: video.briefIntro,
      });

      setOldThumbnail(video.thumbnail);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      setErrors({
        ...errors,
        thumbnail:
          "Only jpg jpeg png webp allowed",
      });

      return;
    }

    setThumbnail(file);

    setThumbnailPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append(
        "categoryId",
        formData.categoryId
      );

      data.append("title", formData.title);

      data.append("slug", formData.slug);

      data.append(
        "youtubeLink",
        formData.youtubeLink
      );

      data.append(
        "briefIntro",
        formData.briefIntro
      );

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      const response = await updateVideoApi(
        id,
        data
      );

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-video");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Video" />

      <div className="space-y-6">

        <ComponentCard title="Edit Video">

          <div className="overflow-hidden rounded-xl border bg-white">

            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Category */}

                  <div>

                    <label>Video Category</label>

                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    >
                      <option value="">
                        Select Category
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

                  </div>

                  {/* Title */}

                  <div>

                    <label>Video Title</label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                  </div>

                  {/* Slug */}

                  <div>

                    <label>Slug</label>

                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                  </div>

                  {/* Youtube */}

                  <div>

                    <label>Youtube Link</label>

                    <input
                      type="text"
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                  </div>

                  {/* Thumbnail */}

                  <div>

                    <label>Thumbnail</label>

                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        className="mb-3 h-24 rounded"
                      />
                    )}

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="block w-full rounded-lg border p-2"
                      onChange={handleImage}
                    />

                  </div>

                  {/* Intro */}

                  <div className="md:col-span-2">

                    <label>Brief Intro</label>

                    <textarea
                      rows={5}
                      name="briefIntro"
                      value={formData.briefIntro}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                  </div>

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
                      className="rounded-lg bg-brand-500 px-5 py-3 text-white"
                    >
                      {isSubmitting
                        ? "Updating..."
                        : "Update Video"}
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