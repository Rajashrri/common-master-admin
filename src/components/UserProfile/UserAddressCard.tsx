import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState } from "react";
import { toast } from "react-toastify";
import { updatePassword } from "../../api/profileApi";
export default function UserAddressCard() {
  const [errors, setErrors] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = async () => {
    const newErrors = {
      current_password: "",
      new_password: "",
      confirm_password: "",
    };

    if (!passwords.current_password) {
      newErrors.current_password = "Old Password is required";
    }

    if (!passwords.new_password) {
      newErrors.new_password = "New Password is required";
    }

    if (!passwords.confirm_password) {
      newErrors.confirm_password = "Confirm Password is required";
    }

    if (
      newErrors.current_password ||
      newErrors.new_password ||
      newErrors.confirm_password
    ) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

    try {
      const res = await updatePassword(passwords);

      toast.success(res.msg);

      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error: any) {
      const message = error?.response?.data?.msg || "Failed to update password";

      if (message === "Current password is incorrect") {
        setErrors({
          current_password: message,
          new_password: "",
          confirm_password: "",
        });
      } else if (message === "New password and confirm password do not match") {
        setErrors({
          current_password: "",
          new_password: "",
          confirm_password: message,
        });
      } else if (
        message === "New password must be different from current password"
      ) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    }
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Change Password
      </h4>

      <div className="w-full space-y-5">
        <div>
          <Label>Old Password</Label>
          <Input
            type="password"
            value={passwords.current_password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                current_password: e.target.value,
              })
            }
          />

          {errors.current_password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.current_password}
            </p>
          )}
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={passwords.new_password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                new_password: e.target.value,
              })
            }
          />

          {errors.new_password && (
            <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>
          )}
        </div>

        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={passwords.confirm_password}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                confirm_password: e.target.value,
              })
            }
          />

          {errors.confirm_password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirm_password}
            </p>
          )}
        </div>

        <div className="pt-3">
          <Button size="sm" onClick={handleSave}>
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
}
