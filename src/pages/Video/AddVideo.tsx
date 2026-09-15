import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { getCategoriesApi } from "../../api/videoCategoryApi";
import { addVideoApi } from "../../api/videoApi";

interface VideoCategory {
  _id: string;
  categoryName: string;
}

export default function AddVideo() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<VideoCategory[]>([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    youtubeLink: "",
    briefIntro: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [errors, setErrors] = useState<any>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateImage = (file: File | null) => {
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
        thumbnail: "Only jpg, jpeg, png & webp allowed",
      });

      return;
    }

    setErrors({
      ...errors,
      thumbnail: "",
    });

    setThumbnail(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: any = {};

    if (!formData.categoryId)
      newErrors.categoryId = "Video Category is required";

    if (!formData.title.trim())
      newErrors.title = "Video Title is required";

    if (!formData.youtubeLink.trim())
      newErrors.youtubeLink = "Youtube Link is required";

    if (!formData.briefIntro.trim())
      newErrors.briefIntro = "Brief Intro is required";

    if (!thumbnail)
      newErrors.thumbnail = "Thumbnail is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("categoryId", formData.categoryId);
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("youtubeLink", formData.youtubeLink);
      data.append("briefIntro", formData.briefIntro);

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      const response = await addVideoApi(data);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-video");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Video" />

      <div className="space-y-6">
        <ComponentCard title="Add Video">
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

                    <p className="text-red-500">
                      {errors.categoryId}
                    </p>
                  </div>

                  {/* Video Title */}

                  <div>
                    <label>Video Title</label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    <p className="text-red-500">
                      {errors.title}
                    </p>
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
                      placeholder="https://youtube.com/..."
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    <p className="text-red-500">
                      {errors.youtubeLink}
                    </p>
                  </div>

                  {/* Thumbnail */}

                  <div>

                    <label>Thumbnail</label>

                    <p className="text-sm text-red-500">
                      Allowed : jpg jpeg png webp
                    </p>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="block w-full rounded-lg border p-2"
                      onChange={(e) =>
                        validateImage(
                          e.target.files?.[0] || null
                        )
                      }
                    />

                    {preview && (
                      <img
                        src={preview}
                        className="mt-3 h-24 rounded"
                      />
                    )}

                    <p className="text-red-500">
                      {errors.thumbnail}
                    </p>

                  </div>

                  {/* Brief Intro */}

                  <div className="md:col-span-2">

                    <label>Brief Intro</label>

                    <textarea
                      rows={5}
                      name="briefIntro"
                      value={formData.briefIntro}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    <p className="text-red-500">
                      {errors.briefIntro}
                    </p>

                  </div>

                  <div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-brand-500 px-5 py-3 text-white"
                    >
                      {isSubmitting
                        ? "Adding..."
                        : "Add Video"}
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