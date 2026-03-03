import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService_url } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { UseAppData } from "../Context/AppContext";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsAuth } = UseAppData();

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${authService_url}/api/auth/login`, {
        code: authResult["code"],
      });
      localStorage.setItem("token", result.data.token);

      setUser(result.data.user);

      toast.success(result.data.message);
      setLoading(false);

      setIsAuth(true);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error("Problem while login");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className=" flex min-h-screen items-center justify-center bg-white px-4">
      <div className=" w-full max-w-sm space-y-6">
        <h1 className=" text-center text-3xl font-bold text-[#E23774]">
          Hungry
        </h1>
        <p className=" text-center text-sm text-gray-500">
          Log in Or Sign up to Continue
        </p>
        <button
          onClick={googleLogin}
          disabled={loading}
          className=" flex w-full items-center justify-center gap-3 rounded-xl border-gray-300 bg-white px-4 py-3"
        >
          <FcGoogle size={20} />
          {loading ? "Signing in ...." : "Continue with google"}
        </button>
        <p className=" text-center text-xs text-gray-400">
          By continuing you agree with our {""}{" "}
          <span className=" text-[#E23774]">Terms of service</span> &{" "}
          <span className=" text-[#E23774]">Privicy Policy</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
