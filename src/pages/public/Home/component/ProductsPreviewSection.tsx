import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/api/productApi";
const img_url = import.meta.env.VITE_IMG_URL;
export const ProductsPreviewSection = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetProductsQuery({
    sort: "newest",
    limit: 6,
  });

  const products = data?.data;

  return (
    <section className="bg-[#0A0A0A] py-24 px-6">
      <div className="container mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-white">
              All Products
            </h2>
            <p className="text-white/40 text-sm mt-2">
              আমাদের প্রিমিয়াম কালেকশন এক নজরে
            </p>
          </div>

          {/* VIEW ALL BUTTON */}
          <Link to={'/shop'} className="cursor-poiner">
            <button
              onClick={() => navigate("/products")}
              className="group flex items-center gap-2 text-xs uppercase text-white font-bold tracking-widest"
            >
              View All
              <MoveRight
                size={16}
                className="group-hover:translate-x-1 transition"
              />
            </button>
          </Link>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="text-white/40 text-center py-20">
            Loading products...
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products?.map((item: any, index: number) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative cursor-pointer"
            >
              {/* CARD */}
              <Link to={`/product/${item.slug}`}>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 hover:border-white/30 transition-all duration-500">
                  {/* IMAGE */}
                  <div className="overflow-hidden">
                    <img
                      src={`${img_url}${item.images?.[0]}`}
                      className="w-full h-80 object-cover group-hover:scale-110 transition duration-[1.8s]"
                    />
                  </div>

                  {/* GRADIENT */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* CONTENT */}
                  <div className="absolute bottom-0 p-6 space-y-2">
                    <h3 className="text-xl font-serif text-white">
                      {item.title}
                    </h3>

                    <p className="text-white/40 text-sm">৳ {item.price}</p>
                  </div>

                  {/* 🔥 HOVER CURSOR EFFECT */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                    <div className="px-5 py-2 bg-white/10 backdrop-blur-md text-white text-xs uppercase tracking-widest rounded-full border border-white/20">
                      View Product
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* EMPTY */}
        {!products?.length && !isLoading && (
          <div className="text-center text-white/30 py-20">
            কোনো প্রোডাক্ট পাওয়া যায়নি
          </div>
        )}
      </div>
    </section>
  );
};
