import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGetProductsQuery } from "@/redux/api/productApi";
import { useGetNestedCategoriesQuery } from "@/redux/api/categoryApi";

type Product = {
  _id: string;
  title: string;
  price: number;
  images: string[];
  slug: string;
};

type Category = {
  _id: string;
  name: string;
};

type ApiResponse = {
  data: Product[];
  meta: {
    totalCount: number;
    totalPages: number;
  };
};

const LIMIT = 10;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "newest";
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 5000);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    category,
    page,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort:
      sort === "low" ? "priceLow" : sort === "high" ? "priceHigh" : "newest",
    limit: LIMIT,
  }) as { data?: ApiResponse; isLoading: boolean; isFetching: boolean };

  const { data: categoriesData } = useGetNestedCategoriesQuery() as {
    data?: { data: Category[] };
  };

  const products = data?.data ?? [];
  const totalPages = data?.meta?.totalPages || 1;

  // animation
  useEffect(() => {
    if (!isFetching) {
      gsap.fromTo(
        ".card",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 },
      );
    }
  }, [isFetching, category, page]);

  const pages = useMemo(() => {
    const arr: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      prev.set(key, value);
      prev.set("page", "1");
      return prev;
    });
  };

  const goPage = (p: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(p));
      return prev;
    });
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#0B0B0B] to-[#121212] text-white py-20 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 pt-10 gap-12">
        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xs tracking-[0.3em] text-white/40 uppercase mb-8">
              কালেকশন
            </h2>

            {/* ALL */}
            <div
              onClick={() => setParam("category", "")}
              className={`cursor-pointer mb-4 transition ${
                !category
                  ? "text-white font-semibold"
                  : "text-white/40 hover:text-white"
              }`}
            >
              সব প্রোডাক্ট
            </div>

            {/* CATEGORY */}
            {categoriesData?.data?.map((cat) => (
              <div
                key={cat._id}
                onClick={() => setParam("category", cat._id)}
                className={`cursor-pointer mb-3 transition text-sm ${
                  category === cat._id
                    ? "text-white font-semibold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {cat.name}
              </div>
            ))}

            {/* PRICE */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-xs text-white/50 mb-3">
                মূল্য সীমা: ৳ {priceRange[0]} - {priceRange[1]}
              </p>

              <input
                type="range"
                min={0}
                max={5000}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceRange([0, val]);
                  setParam("maxPrice", String(val));
                }}
                className="range range-sm w-full accent-gray-500 "
              />
            </div>
          </div>
        </aside>

        {/* ---------------- MAIN ---------------- */}
        <main className="md:col-span-9">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight">
                কালেকশন
              </h1>
              <p className="text-white/40 text-sm mt-2">
                মোট প্রোডাক্ট: {data?.meta?.totalCount || 0}
              </p>
            </div>

            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-xl text-sm"
            >
              <option value="newest">নতুন</option>
              <option value="low">কম দামে</option>
              <option value="high">বেশি দামে</option>
            </select>
          </div>

          {/* LOADING */}
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-white/30" />
            </div>
          ) : (
            <>
              {/* PRODUCTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((p) => (
                  <Link key={p._id} to={`/product/${p.slug}`}>
                    <div className="card group bg-[#151515] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition">
                      <div className="overflow-hidden">
                        <img
                          src={`http://localhost:5000${p.images?.[0]}`}
                          className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="text-white font-medium tracking-wide line-clamp-1">
                          {p.title}
                        </h3>
                        <p className="text-white/40 text-sm mt-1">
                          ৳ {p.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* EMPTY */}
              {products.length === 0 && (
                <div className="text-center py-20 text-white/30">
                  কোনো প্রোডাক্ট পাওয়া যায়নি
                </div>
              )}

              {/* ---------------- PAGINATION ---------------- */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-20 items-center gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => goPage(page - 1)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
                  >
                    <ChevronLeft />
                  </button>

                  {pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => goPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm transition ${
                        page === p
                          ? "bg-white text-black font-bold"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages}
                    onClick={() => goPage(page + 1)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
