import { useDispatch } from "react-redux";
import { login } from "@/redux/userSlice";
import { useRouter } from "next/router";
export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const proceed = () => {
    dispatch(login());
    router.push("/role");
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-2xl font-semibold text-teal mb-1">Welcome</div>
        <div className="text-sm text-gray-600 mb-4">Sign in to continue</div>
        <div className="space-y-2">
          <button onClick={proceed} className="btn w-full bg-teal text-white">
            Continue with Email
          </button>
          <button onClick={proceed} className="btn w-full bg-white border">
            Continue with Google
          </button>
          <button onClick={proceed} className="btn w-full bg-white border">
            Continue with LinkedIn
          </button>
        </div>
        <div className="mt-4 text-sm text-center text-gray-600">
          After sign-in, choose your role →{" "}
          <a className="text-teal underline" href="/role">
            Select Role
          </a>
        </div>
      </div>
    </div>
  );
}
