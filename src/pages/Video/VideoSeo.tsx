import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getSeoByIdApi,
  updateSeoApi,
} from "../../api/videoApi";

export default function VideoSeo() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    thumbnailAlt: "",
    schemaCode: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    const response = await getSeoByIdApi(id);

    if (response.data.success) {
      setFormData({
        metaTitle:
          response.data.data.metaTitle || "",

        metaKeywords:
          response.data.data.metaKeywords || "",

        metaDescription:
          response.data.data.metaDescription || "",

        thumbnailAlt:
          response.data.data.thumbnailAlt || "",

        schemaCode:
          response.data.data.schemaCode || "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    let err: any = {};

    if (!formData.metaTitle.trim()) {
      err.metaTitle =
        "Meta Title is required";
    }

    setErrors(err);

    if (Object.keys(err).length) return;

    try {
      const response = await updateSeoApi(
        id,
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-video");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
      );
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Video SEO" />

      <div className="space-y-6">

        <ComponentCard title="Video SEO">

          <div className="overflow-hidden rounded-xl border bg-white">

            <div className="p-6">

              <form onSubmit={handleSubmit}>

                <div className="grid gap-6">

                  {/* Meta Title */}

                  <div>

                    <label>
                      Meta Title
                    </label>

                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                    {errors.metaTitle && (
                      <p className="text-red-500">
                        {errors.metaTitle}
                      </p>
                    )}

                  </div>

                  {/* Keywords */}

                  <div>

                    <label>
                      Meta Keywords
                    </label>

                    <textarea
                      rows={3}
                      name="metaKeywords"
                      value={
                        formData.metaKeywords
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                  </div>

                  {/* Description */}

                  <div>

                    <label>
                      Meta Description
                    </label>

                    <textarea
                      rows={4}
                      name="metaDescription"
                      value={
                        formData.metaDescription
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3"
                    />

                  </div>

                  {/* Thumbnail Alt */}

                  <div>

                    <label>
                      Thumbnail Alt Tag
                    </label>

                    <input
                      type="text"
                      name="thumbnailAlt"
                      value={
                        formData.thumbnailAlt
                      }
                      onChange={handleChange}
                      className="h-11 w-full rounded-lg border px-4"
                    />

                  </div>

                  {/* Schema */}

                  <div>

                    <label>
                      Schema Code
                    </label>

                    <textarea
                      rows={10}
                      name="schemaCode"
                      value={
                        formData.schemaCode
                      }
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-3 font-mono"
                    />

                  </div>

                  <div className="flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/list-video")
                      }
                      className="rounded-lg border px-6 py-3"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-brand-500 px-6 py-3 text-white"
                    >
                      Update SEO
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