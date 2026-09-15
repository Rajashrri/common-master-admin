import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import {
  getEventSeoByIdApi,
  updateEventSeoApi,
} from "../../api/eventApi";

export default function EventSeo() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading,setLoading]=useState(false);

  const [formData,setFormData]=useState({

    metaTitle:"",
    metaKeywords:"",
    metaDescription:"",
    mainImageAlt:"",
    featuredImageAlt:"",
    schemaCode:""

  });

  useEffect(()=>{

    if(id){
      fetchSeo();
    }

  },[id]);

  const fetchSeo=async()=>{

    try{

      const response=await getEventSeoByIdApi(id!);

      if(response.data.success){

        const data=response.data.data;

        setFormData({

          metaTitle:data.metaTitle || "",
          metaKeywords:data.metaKeywords || "",
          metaDescription:data.metaDescription || "",
          mainImageAlt:data.mainImageAlt || "",
          featuredImageAlt:data.featuredImageAlt || "",
          schemaCode:data.schemaCode || "",

        });

      }

    }catch{

      toast.error("Unable to load SEO");

    }

  };
    // ===========================
  // Input Change
  // ===========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // ===========================
  // Submit
  // ===========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response =
        await updateEventSeoApi(
          id!,
          formData
        );

      if (response.data.success) {

        toast.success(response.data.message);

        navigate("/list-event");

      }

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <>
      <PageBreadcrumb pageTitle="Event SEO" />

      <div className="space-y-6">

        <ComponentCard title="Event SEO">

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-6">

              {/* Meta Title */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Meta Title
                </label>

                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />

              </div>

              {/* Meta Keywords */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Meta Keywords
                </label>

                <textarea
                  rows={3}
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-4"
                />

              </div>
                            {/* Meta Description */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Meta Description
                </label>

                <textarea
                  rows={4}
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 p-4"
                />

              </div>

              {/* Main Image Alt */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Main Image Alt
                </label>

                <input
                  type="text"
                  name="mainImageAlt"
                  value={formData.mainImageAlt}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />

              </div>

              {/* Featured Image Alt */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Featured Image Alt
                </label>

                <input
                  type="text"
                  name="featuredImageAlt"
                  value={formData.featuredImageAlt}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />

              </div>

              {/* Schema Code */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Schema Code
                </label>

                <textarea
                  rows={8}
                  name="schemaCode"
                  value={formData.schemaCode}
                  onChange={handleChange}
                  className="font-mono w-full rounded-lg border border-gray-300 p-4"
                />

              </div>

            </div>

            {/* Buttons */}

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
                disabled={loading}
                className="flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-white disabled:opacity-50"
              >
                {loading && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}

                {loading ? "Updating..." : "Update SEO"}

              </button>

            </div>

          </form>

        </ComponentCard>

      </div>

    </>

  );

}