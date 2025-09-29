import LoginForm from "@/components/form_login";
import LogoutBtn from "@/components/logout_btn";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <LoginForm/>
      <LogoutBtn/>
    </div>
  );
}