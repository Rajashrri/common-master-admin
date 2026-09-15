import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import { addFaqApi } from "../../api/faqApi";
import { getCategoriesApi } from "../../api/faqCategoryApi";

interface Category {
  _id: string;
  categoryName: string;
}

export default function AddFaq() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    question: "",
    answer: "",
  });

  const [errors, setErrors] = useState<any>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================
  // Fetch Categories
  // ==========================

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();

      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error("Unable to load FAQ Categories");
    }
  };

  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // ==========================
  // Validation
  // ==========================

  const validate = () => {
    let err: any = {};

    if (!formData.categoryId) {
      err.categoryId = "FAQ Category is required";
    }

    if (!formData.question.trim()) {
      err.question = "Question is required";
    }

    if (!formData.answer.trim()) {
      err.answer = "Answer is required";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await addFaqApi(formData);

      if (response.data.success) {
        toast.success(response.data.message);

        navigate("/list-faq");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Add FAQ" />

      <div className="space-y-6">
        <ComponentCard title="Add FAQ">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  FAQ Category
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                >
                  <option value="">Select FAQ Category</option>

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

              {/* Question */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Question
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4"
                />

                {errors.question && (
                  <p className="mt-1 text-sm text-red-500">{errors.question}</p>
                )}
              </div>

              {/* Answer */}

              {/* Answer */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Answer
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={8}
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  placeholder="Enter FAQ Answer"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand-500 focus:outline-none"
                />

                {errors.answer && (
                  <p className="mt-1 text-sm text-red-500">{errors.answer}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => navigate("/faq-list")}
                className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-white disabled:opacity-50"
              >
                {isSubmitting && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                )}

                {isSubmitting ? "Saving..." : "Save FAQ"}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
}
