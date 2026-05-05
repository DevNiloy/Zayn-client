import React, { useState, useEffect } from "react";
import { useLoginMutation, useRegisterMutation, useGetMeQuery } from "@/redux/api/authApi";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [shouldFetchUser, setShouldFetchUser] = useState(false); // প্রোফাইল ফেচ করার কন্ট্রোলার
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  // useGetMeQuery ব্যবহার, যা skip লজিক দিয়ে কন্ট্রোল করা হয়েছে
  const { data: userData, isFetching: isFetchingUser, isSuccess: isUserSuccess } = useGetMeQuery(undefined, {
    skip: !shouldFetchUser, // যতক্ষণ লগইন সাকসেস না হবে, ততক্ষণ কল হবে না
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // যখনই ইউজার ডেটা সাকসেসফুলি চলে আসবে, তখন রিডাইরেক্ট হবে
 // যখনই ইউজার ডেটা সাকসেসফুলি চলে আসবে, তখন রিডাইরেক্ট হবে
useEffect(() => {
  if (isUserSuccess && userData) {
    // ডাটা যদি userData.data এর ভেতর থাকে তবে এটা ব্যবহার করুন
    // নতুবা সরাসরি userData.role ব্যবহার করুন (আপনার এপিআই রেসপন্স অনুযায়ী)
    const user = (userData as any)?.data || userData; 
    const userRole = user?.role;
    const userName = user?.name || "User";

    console.log("Current User Role:", userRole); // কনসোলে চেক করুন কি রোল আসছে

    if (userRole === "ADMIN") {
      navigate("/adminpannel");
    } else if (userRole === "USER" || userRole) {
      navigate("/");
    }

    // সাকসেস মেসেজ রিডাইরেক্টের আগে বা পরে দেখাতে পারেন
    Swal.fire({
      title: "Success",
      text: `Welcome, ${userName}!`,
      icon: "success",
      background: "#1d1d1d",
      color: "#fff",
      timer: 1500, // অটোমেটিক ক্লোজ হবে যাতে রিডাইরেকশনে দেরি না হয়
      showConfirmButton: false
    });
  }
}, [isUserSuccess, userData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password }).unwrap();
      } else {
        await register(formData).unwrap();
      }
      
      // লগইন/রেজিস্ট্রেশন সফল হলে প্রোফাইল ফেচ করার সিগন্যাল দেওয়া
      setShouldFetchUser(true);

    } catch (err: any) {
      setShouldFetchUser(false);
      Swal.fire({
        title: "Error",
        text: err?.data?.message || "Authentication failed.",
        icon: "error",
        background: "#1d1d1d",
        color: "#fff",
      });
    }
  };

  const isProcessing = isLoginLoading || isRegisterLoading || isFetchingUser;

  return (
    <div className="flex min-h-screen bg-[#1d1d1d] text-white font-sans overflow-x-hidden">
      {/* Left Side - Image Background */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-white/5">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000"
          alt="Luxury Perfume"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1d] via-transparent to-[#1d1d1d]/40" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-20 text-center">
          <h1 className="text-6xl font-serif tracking-tighter leading-tight mb-6 uppercase">
            Unveil Your <br /> Scent Identity
          </h1>
          <p className="text-white/40 tracking-[0.3em] uppercase text-[10px] font-bold whitespace-nowrap">
            The Private Collection awaits your curation
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-[450px] w-full mx-auto">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-3xl font-serif tracking-widest uppercase mb-4">Account - ZAYN</h2>
            <div className="flex justify-center lg:justify-start gap-6 text-[11px] tracking-[0.3em] font-bold uppercase">
              <button 
                type="button"
                onClick={() => { setIsLogin(true); setShouldFetchUser(false); }}
                className={`pb-2 border-b-2 transition-all cursor-pointer ${isLogin ? 'text-white border-white' : 'text-white/20 border-transparent hover:text-white/50'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setIsLogin(false); setShouldFetchUser(false); }}
                className={`pb-2 border-b-2 transition-all cursor-pointer ${!isLogin ? 'text-white border-white' : 'text-white/20 border-transparent hover:text-white/50'}`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Full Name</label>
                <div className="relative border-b border-white/10 group-focus-within:border-white transition-all pb-2">
                   <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                   <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent pl-8 focus:outline-none text-sm placeholder:text-white/10"
                    placeholder="Anisul Haque"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Email Address</label>
              <div className="relative border-b border-white/10 group-focus-within:border-white transition-all pb-2">
                 <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                 <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent pl-8 focus:outline-none text-sm placeholder:text-white/10"
                  placeholder="identity@zaynoils.com"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Password</label>
              <div className="relative border-b border-white/10 group-focus-within:border-white transition-all pb-2">
                 <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                 <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent px-8 focus:outline-none text-sm placeholder:text-white/10"
                  placeholder="••••••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-white text-black h-14 rounded-none text-[11px] uppercase tracking-[0.4em] font-bold transition-all hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                isLogin ? "Authenticate" : "Create Account"
              )}
            </button>
          </form>

          {/* Social Sign In */}
          <div className="mt-16">
             <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-bold text-white/10 mb-10">
                <span className="bg-[#1d1d1d] px-4 relative z-10">Or continue with</span>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <button className="border border-white/5 bg-transparent hover:bg-white/5 text-[10px] tracking-widest uppercase py-4 font-bold cursor-pointer transition-colors">
                  Google
                </button>
                <button className="border border-white/5 bg-transparent hover:bg-white/5 text-[10px] tracking-widest uppercase py-4 font-bold cursor-pointer transition-colors">
                  Apple
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;