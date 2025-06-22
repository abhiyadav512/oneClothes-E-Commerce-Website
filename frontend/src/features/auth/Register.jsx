import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, MapPin, Calendar, EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [passwordShow, setPasswordShow] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    dob: "",
  });

  const registerMutation = useRegister({
    onSuccess: (data) => {
      toast.success("Registration successful! Check your email.");
      navigate("/verify-otp", { state: { email: form.email } });
    }
    ,
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors || 'Registration failed.');
    },
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    // console.log({id,value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      location: form.location,
      dob: form.dob,
    };
    // console.log(payload);
    registerMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full  p-8 ">
        <h3 className="text-center font-thin text-3xl mb-4">OneClothes</h3>
        <h2 className="text-2xl font-semibold mb-6 text-center">Create your account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                required
                className="pl-9"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="pl-9"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="password"
                type={passwordShow ? "text" : "password"}
                placeholder="Create a password"
                required
                className="pl-9"
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setPasswordShow(!passwordShow)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                tabIndex={-1}
              >
                {passwordShow ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="location"
                type="text"
                placeholder="Your city"
                required
                className="pl-9"
                value={form.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="dob"
                type="date"
                required
                className="pl-9"
                min="1900-01-01"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
