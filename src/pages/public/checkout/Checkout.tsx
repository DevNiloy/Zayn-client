import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { clearCart, addToCart } from "@/redux/feature/cart/cartSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { usePlaceOrderMutation } from "@/redux/api/orderApi";

// ✅ MongoDB ObjectId check
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

// --- Zara Vibe Dark Toast Configuration ---
const zaraTheme = {
  background: "#1d1d1d",
  color: "#ffffff",
  confirmButtonColor: "#ffffff",
  cancelButtonColor: "transparent",
  customClass: {
    popup: "border border-gray-800 rounded-none shadow-2xl font-serif",
    confirmButton:
      "text-black bg-white px-8 py-3 rounded-none uppercase tracking-widest text-xs font-bold border-none",
    cancelButton:
      "text-white border border-gray-700 px-8 py-3 rounded-none uppercase tracking-widest text-xs font-bold ml-4",
    title: "text-xl italic tracking-tight",
  },
  buttonsStyling: false,
};

const CheckoutPage = () => {
  const img_url = import.meta.env.VITE_IMG_URL;
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [placeOrder] = usePlaceOrderMutation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    email: "",
  });

  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">(
    "inside",
  );

  // ================= ADS FLOW
  useEffect(() => {
    const productId = searchParams.get("productId");
    const name = searchParams.get("name");
    const price = searchParams.get("price");
    const img = searchParams.get("img");

    if (!productId || !name || !price) return;
    if (!isValidObjectId(productId)) return;

    const exists = items.find((i) => i.id === productId);
    if (exists) return;

    dispatch(
      addToCart({
        id: productId,
        name,
        price: Number(price),
        qty: 1,
        img: img || "",
      }),
    );
  }, [searchParams]);

  // ================= CALCULATION
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCharge = deliveryArea === "inside" ? 70 : 120;
  const grandTotal = subtotal + shippingCharge;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ================= ORDER SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      return Swal.fire({
        ...zaraTheme,
        title: "কার্ট খালি",
        text: "প্রোডাক্ট যোগ করুন",
        icon: "warning",
        confirmButtonText: "ঠিক আছে",
      });
    }

    const confirm = await Swal.fire({
      ...zaraTheme,
      title: "আপনি কি নিশ্চিত?",
      text: "অর্ডারটি কনফার্ম করতে চাচ্ছেন?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, কনফার্ম",
      cancelButtonText: "না",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        ...zaraTheme,
        title: "অর্ডার প্রসেস হচ্ছে...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      const payload = {
        customer: formData,
        orderItems: items
          .filter((item) => isValidObjectId(String(item.id)))
          .map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            image: item.img,
            product: item.id,
          })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod: "COD",
        totalPrice: grandTotal,
        deliveryArea,
      };

      await placeOrder(payload).unwrap();

      Swal.fire({
        ...zaraTheme,
        icon: "success",
        title: "সফল!",
        text: "আপনার অর্ডারটি নেওয়া হয়েছে।",
        confirmButtonText: "হোম পেজে যান",
      });

      dispatch(clearCart());
      navigate("/");
    } catch (err) {
      Swal.fire({
        ...zaraTheme,
        icon: "error",
        title: "Error",
        text: "অর্ডার ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1d1d1d] text-white pt-24 px-4 md:px-20 font-serif">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl italic mb-8 border-b border-gray-800 pb-4">
            চেকআউট
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="name"
              onChange={handleChange}
              placeholder="নাম"
              className="input"
              required
            />
            <input
              name="phone"
              onChange={handleChange}
              placeholder="ফোন"
              className="input"
              required
            />
            <textarea
              name="address"
              onChange={handleChange}
              placeholder="ঠিকানা"
              className="input"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                onChange={handleChange}
                placeholder="শহর"
                className="input"
              />
              <input
                name="zipCode"
                onChange={handleChange}
                placeholder="ZIP"
                className="input"
              />
            </div>

            <input
              name="email"
              onChange={handleChange}
              placeholder="ইমেইল"
              className="input"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeliveryArea("inside")}
                className={`btn ${deliveryArea === "inside" ? "active" : ""}`}
              >
                ঢাকা (৳70)
              </button>
              <button
                type="button"
                onClick={() => setDeliveryArea("outside")}
                className={`btn ${deliveryArea === "outside" ? "active" : ""}`}
              >
                বাইরে (৳120)
              </button>
            </div>

            <button className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest text-sm">
              অর্ডার কনফার্ম করুন
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 bg-[#171717] p-6 border border-gray-800">
          <h2 className="text-xl mb-6 italic">অর্ডার সামারি</h2>
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 mb-6">
              <img
                src={
                  item.img?.startsWith("http")
                    ? item.img
                    : item.img
                      ? `${img_url}${item.img}`
                      : "/placeholder.png"
                }
                className="w-20 h-24 object-cover border border-gray-800"
              />
              <div className="flex-1">
                <p className="tracking-wide">{item.name}</p>
                <p className="text-sm text-gray-400 font-sans">
                  Qty: {item.qty}
                </p>
              </div>
              <p className="font-sans">৳{item.price * item.qty}</p>
            </div>
          ))}

          <div className="border-t border-gray-800 pt-4 space-y-2">
            <div className="flex justify-between font-sans">
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            <div className="flex justify-between font-sans">
              <span>Shipping</span>
              <span>৳{shippingCharge}</span>
            </div>
            <div className="flex justify-between text-xl font-bold font-sans pt-2">
              <span>Total</span>
              <span>৳{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 14px;
          background: #111;
          border: 1px solid #333;
          outline: none;
          color: white;
          font-family: inherit;
        }
        .input::placeholder {
            color: #555;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
        }
        .btn {
          padding: 10px 16px;
          border: 1px solid #444;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }
        .active {
          background: white;
          color: black;
          border-color: white;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
