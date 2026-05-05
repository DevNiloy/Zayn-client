import { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Star, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
const img_url = import.meta.env.VITE_IMG_URL;
import {
  useGetProductBySlugQuery,
  useCreateReviewMutation,
} from "@/redux/api/productApi";

import { useGetMeQuery } from "@/redux/api/authApi";
import { addToCart } from "@/redux/feature/cart/cartSlice";

// ---------------- TYPES ----------------
type Review = {
  name: string;
  rating: number;
  comment: string;
  user?: string;
};

type Product = {
  _id: string;
  title: string;
  desc: string;
  price: number;
  images: string[];
  stock: string;
  category?: { name: string };
  ratings?: {
    average: number;
    count: number;
  };
  reviews: Review[];
};

// --- Zara Vibe Dark Toast Configuration ---
const zaraTheme = {
  background: "#121212",
  color: "#ffffff",
  confirmButtonColor: "#ffffff",
  customClass: {
    popup: "border border-white/10 rounded-none shadow-2xl font-serif",
    confirmButton:
      "text-black bg-white px-8 py-2 rounded-none uppercase tracking-widest text-[10px] font-bold border-none",
    cancelButton:
      "text-white border border-white/20 px-8 py-2 rounded-none uppercase tracking-widest text-[10px] font-bold ml-2",
    title: "text-lg italic tracking-tight",
  },
  buttonsStyling: false,
};

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { data: user } = useGetMeQuery();
  const { data, isLoading } = useGetProductBySlugQuery(slug!);
  const [createReview, { isLoading: reviewLoading }] =
    useCreateReviewMutation();

  const product = data as Product | undefined;

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  // LOADING
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center text-white/40">
        প্রোডাক্ট পাওয়া যায়নি
      </div>
    );
  }

  // ADD TO CART
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.title,
        price: product.price,
        qty: 1,
        img: product.images?.[0],
        slug: product._id,
        desc: product.desc,
      }),
    );

    // ✅ Modified Toast
    Swal.fire({
      ...zaraTheme,
      icon: "success",
      title: "কার্টে যোগ হয়েছে",
      text: "প্রোডাক্টটি আপনার কার্টে যোগ করা হয়েছে",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const alreadyReviewed = product.reviews?.some((r) => r.user === user?._id);

  const handleReviewSubmit = async () => {
    if (!user) {
      Swal.fire({
        ...zaraTheme,
        title: "লগইন করুন",
        text: "রিভিউ দিতে হলে লগইন করতে হবে",
        icon: "warning",
        confirmButtonText: "ঠিক আছে",
      });
      return;
    }

    if (alreadyReviewed) {
      Swal.fire({
        ...zaraTheme,
        title: "একবারই রিভিউ",
        text: "আপনি ইতিমধ্যে রিভিউ দিয়েছেন",
        icon: "info",
        confirmButtonText: "বুঝেছি",
      });
      return;
    }

    if (!comment.trim()) {
      Swal.fire({
        ...zaraTheme,
        title: "ভুল",
        text: "দয়া করে একটি রিভিউ লিখুন",
        icon: "error",
        confirmButtonText: "আবার চেষ্টা করুন",
      });
      return;
    }

    try {
      await createReview({
        id: product._id,
        rating,
        comment,
      }).unwrap();

      Swal.fire({
        ...zaraTheme,
        icon: "success",
        title: "ধন্যবাদ",
        text: "আপনার রিভিউ সফলভাবে যোগ হয়েছে",
        confirmButtonText: "বন্ধ করুন",
      });

      setComment("");
      setRating(5);
    } catch {
      Swal.fire({
        ...zaraTheme,
        icon: "error",
        title: "Error",
        text: "দুঃখিত, রিভিউ যোগ করা যায়নি",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-20 font-serif">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* IMAGE */}
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <img
            src={`${img_url}${product.images?.[0]}`}
            className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* INFO */}
        <div className="space-y-6">
          <h1 className="text-4xl italic tracking-tight">{product.title}</h1>
          <div className="text-4xl font-bold text-white font-sans">
            ৳ {product.price.toLocaleString("bn-BD")}
          </div>
          <p className="text-white/60 leading-relaxed">{product.desc}</p>
          <div className="space-y-1">
            <p className="text-sm text-white/40 font-sans">
              স্টক: {product.stock}
            </p>
            <p className="text-xs text-white/30 uppercase tracking-widest">
              ক্যাটাগরি: {product.category?.name}
            </p>
          </div>

          {/* ⭐ RATING */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                size={18}
                className={`cursor-pointer transition ${
                  star <= Math.round(product.ratings?.average || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-white/20"
                }`}
              />
            ))}
            <span className="text-white/40 text-sm ml-2 font-sans">
              ({product.ratings?.count || 0})
            </span>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="flex cursor-pointer items-center gap-3 bg-white text-black px-8 py-4 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* REVIEW SECTION */}
      <div className="container mx-auto mt-20 border-t border-white/10 pt-10">
        <h2 className="text-2xl font-bold mb-6 italic uppercase tracking-tighter">
          রিভিউ দিন
        </h2>
        <div className="max-w-lg space-y-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                size={20}
                className={`cursor-pointer transition ${
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-white/20"
                }`}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="আপনার মতামত লিখুন..."
            className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-none focus:border-white/30 outline-none transition"
            rows={4}
          />
          <button
            onClick={handleReviewSubmit}
            disabled={reviewLoading || alreadyReviewed}
            className="bg-white text-black px-10 py-3 rounded-none font-bold uppercase tracking-widest text-[10px] disabled:opacity-30"
          >
            {alreadyReviewed ? "আগে রিভিউ দিয়েছেন" : "সাবমিট রিভিউ"}
          </button>
        </div>

        {/* REVIEWS LIST */}
        <div className="mt-16 space-y-6">
          <h3 className="text-white/40 uppercase text-xs tracking-[0.3em] mb-8">
            কাস্টমার ফিডব্যাক
          </h3>
          {product.reviews?.length === 0 && (
            <p className="text-white/20 italic">এখনো কোনো রিভিউ নেই</p>
          )}
          {product.reviews?.map((rev, i) => (
            <div key={i} className="p-6 border-b border-white/5 bg-transparent">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold tracking-tight text-white/90">
                  {rev.name}
                </p>
                <div className="text-yellow-400 text-xs">
                  {"★".repeat(rev.rating)}
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
