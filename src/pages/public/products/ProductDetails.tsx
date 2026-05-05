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
        প্রোডাক্ট পাওয়া যায়নি
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
      })
    );

    Swal.fire({
      icon: "success",
      title: "কার্টে যোগ হয়েছে",
      text: "প্রোডাক্টটি আপনার কার্টে যোগ করা হয়েছে",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const alreadyReviewed = product.reviews?.some(
    (r) => r.user === user?._id
  );

  const handleReviewSubmit = async () => {
    if (!user) {
      Swal.fire("লগইন করুন", "রিভিউ দিতে হলে লগইন করতে হবে", "warning");
      return;
    }

    if (alreadyReviewed) {
      Swal.fire("একবারই রিভিউ", "আপনি ইতিমধ্যে রিভিউ দিয়েছেন", "info");
      return;
    }

    if (!comment.trim()) {
      Swal.fire("ভুল", "রিভিউ লিখুন", "error");
      return;
    }

    try {
      await createReview({
        id: product._id,
        rating,
        comment,
      }).unwrap();

      Swal.fire("ধন্যবাদ", "আপনার রিভিউ যোগ হয়েছে", "success");

      setComment("");
      setRating(5);
    } catch {
      Swal.fire("Error", "রিভিউ যোগ করা যায়নি", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-20">

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* IMAGE */}
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <img
            src={`${img_url}${product.images?.[0]}`}
            className="w-full h-[500px] object-cover"
          />
        </div>

        {/* INFO */}
        <div className="space-y-6">

          <h1 className="text-4xl font-serif">{product.title}</h1>

          <div className="text-4xl font-bold text-white">
            ৳ {product.price}
          </div>

          <p className="text-white/60">{product.desc}</p>

          <p className="text-sm text-white/40">
            স্টক: {product.stock}
          </p>

          <p className="text-xs text-white/30 uppercase">
            ক্যাটাগরি: {product.category?.name}
          </p>

          {/* ⭐ RATING */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${
                  star <= Math.round(product.ratings?.average || 0)
                    ? "text-yellow-400"
                    : "text-white/20"
                }`}
              />
            ))}
            <span className="text-white/40 text-sm ml-2">
              ({product.ratings?.count || 0})
            </span>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition cursor-pointer"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* REVIEW SECTION */}
      <div className="container mx-auto mt-20 border-t border-white/10 pt-10">

        <h2 className="text-2xl font-bold mb-6">রিভিউ দিন</h2>

        <div className="max-w-lg space-y-4">

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${
                  star <= rating ? "text-yellow-400" : "text-white/20"
                }`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="আপনার মতামত লিখুন..."
            className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-xl"
          />

          <button
            onClick={handleReviewSubmit}
            disabled={reviewLoading || alreadyReviewed}
            className="bg-white text-black px-6 py-2 rounded-xl font-bold disabled:opacity-50 cursor-pointer"
          >
            {alreadyReviewed ? "আগে রিভিউ দিয়েছেন" : "সাবমিট রিভিউ"}
          </button>
        </div>

        {/* REVIEWS */}
        <div className="mt-10 space-y-6">
          {product.reviews?.length === 0 && (
            <p className="text-white/40">এখনো কোনো রিভিউ নেই</p>
          )}

          {product.reviews?.map((rev, i) => (
            <div
              key={i}
              className="p-4 border border-white/10 rounded-xl bg-[#151515]"
            >
              <div className="flex justify-between">
                <p className="font-bold">{rev.name}</p>
                <div className="text-yellow-400">
                  {"★".repeat(rev.rating)}
                </div>
              </div>

              <p className="text-white/60 mt-2">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}