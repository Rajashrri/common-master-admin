import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { updateWebsiteSettingApi,getWebsiteSettingApi } from "../../api/profileApi";

export default function WebsiteSettingCard() {
  const [logo, setLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);

  const [preview, setPreview] = useState({
    logo: "",
    favicon: "",
  });



  useEffect(() => {
  loadWebsiteSetting();
}, []);

const loadWebsiteSetting = async () => {
  try {
    const res = await getWebsiteSettingApi();

    if (res.success && res.data) {
      setPreview({
        logo: res.data.logo || "",
        favicon: res.data.favicon || "",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogo(file);

    setPreview((prev) => ({
      ...prev,
      logo: URL.createObjectURL(file),
    }));
  };

  const handleFavicon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFavicon(file);

    setPreview((prev) => ({
      ...prev,
      favicon: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    if (!logo && !favicon) {
      return toast.error("Please select Logo or Favicon");
    }

    const formData = new FormData();

    if (logo) {
      formData.append("logo", logo);
    }

    if (favicon) {
      formData.append("favicon", favicon);
    }

    try {
      const res = await updateWebsiteSettingApi(formData);

      toast.success(res.msg);
      setPreview({
  logo: res.data.logo,
  favicon: res.data.favicon,
});
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-5 lg:p-6">
      <h4 className="mb-6 text-lg font-semibold">
        Website Settings
      </h4>

      <div className="space-y-6">

        {/* Logo */}
        <div>
          <Label>Website Logo</Label>

          <Input
            type="file"
            accept="image/*"
            onChange={handleLogo}
          />

          {preview.logo && (
            <img
              src={preview.logo}
              alt="logo"
              className="mt-3 h-20 rounded border"
            />
          )}
        </div>

        {/* Favicon */}
        <div>
          <Label>Website Favicon</Label>

          <Input
            type="file"
            accept=".png,.jpg,.jpeg,.ico"
            onChange={handleFavicon}
          />

          {preview.favicon && (
            <img
              src={preview.favicon}
              alt="favicon"
              className="mt-3 h-12 w-12 rounded border"
            />
          )}
        </div>

        <Button onClick={handleSave}>
          Update Website
        </Button>

      </div>
    </div>
  );
}