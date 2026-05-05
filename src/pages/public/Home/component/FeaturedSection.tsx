import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { Link } from "react-router-dom";
const img_url = import.meta.env.VITE_IMG_URL;
const api_url = import.meta.env.VITE_API_URL;

// const containerVariants = {
//   hidden: {},
//   show: {
//     transition: {
//       staggerChildren: 0.15,
//     },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 80 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.8,
//       ease: "easeOut",
//     },
//   },
// };

export const FeaturedSection = () => {
  const { data } = useGetProductsQuery({
    sort: "newest",
    limit: 6,
  });
  // @ts-ignore
  const products = data?.data?.filter((p: any) => p.bestSeller);

  const mainProduct = products?.[0]; // 🔥 hero product
  console.log(mainProduct)
  const id = mainProduct?._id
  const name = mainProduct?.title
  const price = mainProduct?.price
  const img = mainProduct?.images
  // const restProducts = products?.slice(1);

  return (
    <section className="bg-black py-24 px-6 min-h-screen">
      <div className="container mx-auto">
        {/* HEADER */}
        <div className="mb-20 text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-white tracking-tight">
            Best Sellers
          </h2>
          <p className="text-white/40 mt-4 text-sm">
            আমাদের সবচেয়ে জনপ্রিয় ও প্রিমিয়াম সুগন্ধি কালেকশন
          </p>
        </div>

        {/* 🔥 HERO FEATURED PRODUCT */}
        {mainProduct && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="grid md:grid-cols-2 gap-14 items-center mb-28"
          >
            {/* IMAGE */}
            <div className="relative group">
              {/* Glow Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-60 group-hover:opacity-100 transition duration-700 rounded-3xl" />

              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <img
                src={`${img_url}${mainProduct.images?.[0]}`}
                  className="w-full h-[520px] object-cover scale-105 group-hover:scale-115 transition duration-[2.5s] ease-out"
                />

                {/* Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
                  <div className="w-1/3 h-full bg-white/10 blur-2xl rotate-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-all duration-[1.8s]" />
                </div>
              </div>
            </div>

            {/* TEXT CONTENT */}
            <div className="space-y-7">
              <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">
                Signature Collection
              </span>

              <h3 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Royal Perfume Oil Set
              </h3>

              <p className="text-white/50 text-sm leading-relaxed max-w-md">
                এই এক্সক্লুসিভ কালেকশনটি তৈরি করা হয়েছে আধুনিক সৌন্দর্য ও রাজকীয়
                অভিজাততার সমন্বয়ে। প্রতিটি সুগন্ধ আপনাকে আলাদা উপস্থিতি
                দেবে—যেখানে স্টাইল ও ব্যক্তিত্ব একসাথে কথা বলে।
              </p>

              {/* 🔥 BULLET LIST */}
              <div className="space-y-3">
                {[
                  "Tomford Oud",
                  "Bleu de Chanel",
                  "Vampire Blood",
                  "Aqua di Gio",
                  "Dunhill Icon",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full opacity-70" />
                    <p className="text-white/80 text-sm tracking-wide">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-white text-xl font-semibold tracking-wide">
                ৳ {mainProduct.price}
              </p>

              <Link to={`http://localhost:5173/checkout?productId=${id}&name=${name}&price=${price}&img=${api_url}${img}`} className="cursor-pointer">
                <button className="flex items-center gap-3 text-xs uppercase text-white font-bold hover:gap-6 transition-all border-b border-white/20 pb-2 w-fit">
                  এখনই কিনুন <MoveRight size={16} />
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* EMPTY */}
        {!products?.length && (
          <div className="text-center text-white/30 py-20">
            কোনো Best Seller পাওয়া যায়নি
          </div>
        )}
      </div>
    </section>
  );
};
