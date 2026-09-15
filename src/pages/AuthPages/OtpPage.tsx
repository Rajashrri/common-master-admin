import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import Otp from "../../components/auth/Otp";

export default function OtpPage() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <Otp />
      </AuthLayout>
    </>
  );
}
