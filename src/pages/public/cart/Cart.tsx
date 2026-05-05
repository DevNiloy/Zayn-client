import { removeFromCart, updateQuantity } from "@/redux/feature/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const img_url = import.meta.env.VITE_API_URL;
  console.log(items);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  const shipping = items.length > 0 ? 0 : 0;
  const grandTotal = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#121212] text-white  pt-28 pb-14 px-4 md:px-24 font-serif">
      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl italic mb-2">আপনার শপিং ব্যাগ</h1>
        <p className="text-white/40 uppercase text-xs tracking-widest">
          নির্বাচিত প্রিমিয়াম প্রোডাক্টসমূহ
        </p>
      </div>

      <div className="container mx-auto  border-t border-white/10">
        {/* ================= EMPTY CART ================= */}
        {items.length === 0 ? (
          <div className="text-center py-28">
            <ShoppingBag className="mx-auto mb-4 text-white/30" size={40} />
            <p className="text-white/40 uppercase mb-6">আপনার ব্যাগটি খালি</p>

            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition uppercase text-xs tracking-widest"
            >
              কেনাকাটা শুরু করুন
            </button>
          </div>
        ) : (
          <>
            {/* ================= ITEMS ================= */}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center justify-between py-10 border-b border-white/10 gap-8"
              >
                {/* IMAGE */}
                <div className="w-36 h-44 bg-[#1a1a1a] overflow-hidden shrink-0 rounded-xl">
                  <img
                    // src={item.img || "/placeholder.png"}
                    src={`${img_url}${item.img}`}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 text-center md:text-left space-y-2">
                  <h2 className="text-xl">{item.name}</h2>

                  <p className="text-white/40 text-xs uppercase tracking-widest">
                    প্রিমিয়াম কালেকশন
                  </p>

                  {/* QUANTITY */}
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              delta: -1,
                            }),
                          )
                        }
                        className="p-2 hover:bg-white hover:text-black transition"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="px-4 text-sm">{item.qty}</span>

                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              delta: 1,
                            }),
                          )
                        }
                        className="p-2 hover:bg-white hover:text-black transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="flex items-center gap-1 text-white/40 hover:text-red-400 text-xs uppercase"
                    >
                      <Trash2 size={14} />
                      সরান
                    </button>
                  </div>
                </div>

                {/* PRICE */}
                <div className="text-lg font-semibold">
                  ৳ {(item.price * item.qty).toLocaleString("bn-BD")}
                </div>
              </div>
            ))}

            {/* ================= SUMMARY ================= */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* LEFT TEXT */}
              <div className="text-white/40 text-sm space-y-4">
                <h3 className="text-white text-lg italic">
                  আমাদের প্রতিশ্রুতি
                </h3>
                <p className="leading-relaxed">
                  প্রতিটি প্রোডাক্ট যত্নসহকারে নির্বাচন করা হয়। আপনার অর্ডার
                  প্রসেস করার আগে আমরা গুণগত মান নিশ্চিত করি।
                </p>
              </div>

              {/* RIGHT TOTAL */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-white/40">
                  <span>সাবটোটাল</span>
                  <span className="text-white">
                    ৳ {subtotal.toLocaleString("bn-BD")}
                  </span>
                </div>

                {/* <div className="flex justify-between text-sm text-white/40">
                  <span>শিপিং</span>
                  <span className="text-white">ফ্রি</span>
                </div> */}

                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                  <span className="text-2xl italic">মোট</span>
                  <span className="text-3xl text-yellow-400 font-light">
                    ৳ {grandTotal.toLocaleString("bn-BD")}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-white text-black py-4 mt-6 uppercase font-bold hover:bg-white/90 transition tracking-widest"
                >
                  চেকআউট করুন
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
