import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/store/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordShow, setPasswordShow] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const loginMutation = useLogin({
    onSuccess: (data) => {
      const { token, user } = data.data;
      dispatch(setToken(token));
      dispatch(setUser(user));
      toast.success("Login successful!");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors || 'Login failed.');
    }
  })

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: form.email,
      password: form.password,
    };
    loginMutation.mutate(payload);
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-6">
      <div className="max-w-md w-full  p-8">
        <h3 className="text-center font-thin text-3xl mb-4">OneClothes</h3>
        <h2 className="text-2xl font-light mb-6 text-center">Sign in to your account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <Label htmlFor="email" className="block mb-1 font-medium">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="email"
                type="email"
                value={form.email}
                placeholder="you@example.com"
                required
                className="pl-9 w-full"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="block mb-1 font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="password"
                type={passwordShow ? "text" : "password"}
                value={form.password}
                placeholder="Enter your password"
                required
                className="pl-9 w-full"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setPasswordShow(!passwordShow)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                aria-label={passwordShow ? "Hide password" : "Show password"}
              >
                {passwordShow ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-sm text-gray-500">
            <span className="bg-white px-2">Or continue with</span>
          </div>
        </div> */}

        {/* <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <FaGoogle size={20} />
          Login with Google
        </Button> */}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
