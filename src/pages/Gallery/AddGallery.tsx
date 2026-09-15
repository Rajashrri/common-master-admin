import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { addGalleryApi } from "../../api/galleryApi";
import { getCategoriesApi } from "../../api/galleryCategoryApi";
interface GalleryCategory {
  _id: string;
  categoryName: string;
}

export default function AddGallery() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<GalleryCategory[]>([]);

  const [categoryId, setCategoryId] = useState("");

  const [imageName, setImageName] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await getCategoriesApi();

    if (response.data.success) {
      setCategories(response.data.data);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let err: any = {};

    if (!categoryId) {
      err.categoryId = "Gallery Category is required";
    }

    if (!imageName.trim()) {
      err.imageName = "Image Name is required";
    }

    if (!image) {
      err.image = "Gallery Image is required";
    }

    setErrors(err);

    if (Object.keys(err).length) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("categoryId", categoryId);

      formData.append("imageName", imageName);

      if (image) {
        formData.append("image", image);
      }

      const response = await addGalleryApi(formData);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-gallery");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add Gallery" />

      <div className="space-y-6">
        <ComponentCard title="Add Gallery">
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">

                  {/* Category */}

                  <div>
                    <label>Gallery Category</label>

                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
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

                    {errors.categoryId && (
                      <p className="text-red-500">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>

                  {/* Image Name */}

                  <div>
                    <label>Image Name</label>

                    <input
                      type="text"
                      value={imageName}
                      onChange={(e) =>
                        setImageName(e.target.value)
                      }
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.imageName && (
                      <p className="text-red-500">
                        {errors.imageName}
                      </p>
                    )}
                  </div>

                  {/* Image */}

                  <div>
                    <label>Gallery Image</label>

                    <p className="mt-1 text-sm text-red-500">
                      Allowed: .jpg, .jpeg, .png, .webp
                    </p>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="block w-full rounded-lg border border-gray-300 p-2"
                      onChange={(e) => {
                        const file =
                          e.target.files?.[0];

                        if (!file) return;

                        if (
                          ![
                            "image/jpeg",
                            "image/png",
                            "image/webp",
                          ].includes(file.type)
                        ) {
                          setErrors({
                            ...errors,
                            image:
                              "Only jpg, jpeg, png, webp allowed",
                          });

                          return;
                        }

                        setErrors({
                          ...errors,
                          image: "",
                        });

                        setImage(file);

                        setPreview(
                          URL.createObjectURL(file)
                        );
                      }}
                    />

                    {preview && (
                      <img
                        src={preview}
                        className="mt-3 h-28 w-32 rounded-lg border object-cover"
                      />
                    )}

                    {errors.image && (
                      <p className="text-red-500">
                        {errors.image}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-brand-500 px-5 py-3 text-white"
                    >
                      {isSubmitting
                        ? "Adding..."
                        : "Add Gallery"}
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