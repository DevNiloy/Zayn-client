import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { clearCart, addToCart } from "@/redux/feature/cart/cartSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { usePlaceOrderMutation } from "@/redux/api/orderApi";

// ✅ MongoDB ObjectId check
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

const CheckoutPage = () => {
  const img_url= import.meta.env.VITE_IMG_URL
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

  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");

  // ================= ADS FLOW (ONLY productId)
  useEffect(() => {
    const productId = searchParams.get("productId");
    const name = searchParams.get("name");
    const price = searchParams.get("price");
    const img = searchParams.get("img");

    if (!productId || !name || !price) return;

    // ❌ INVALID ID BLOCK
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
      })
    );
  }, [searchParams]);

  // ================= CALCULATION
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCharge = deliveryArea === "inside" ? 70 : 120;
  const grandTotal = subtotal + shippingCharge;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ================= ORDER SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      return Swal.fire("কার্ট খালি", "প্রোডাক্ট যোগ করুন", "warning");
    }

    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ",
    });

    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "অর্ডার প্রসেস হচ্ছে...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
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

      Swal.fire("সফল!", "অর্ডার নেওয়া হয়েছে", "success");

      dispatch(clearCart());
      navigate("/");
    } catch (err) {
      Swal.fire("Error", "অর্ডার ব্যর্থ হয়েছে", "error");
    }
  };

  return (
    <div className="min-h-screen  bg-[#1d1d1d] text-white pt-24 px-4 md:px-20 font-serif">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl italic mb-8 border-b border-gray-800 pb-4">
            চেকআউট
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input name="name" onChange={handleChange} placeholder="নাম" className="input" required />
            <input name="phone" onChange={handleChange} placeholder="ফোন" className="input" required />
            <textarea name="address" onChange={handleChange} placeholder="ঠিকানা" className="input" required />

            <div className="grid grid-cols-2 gap-4">
              <input name="city" onChange={handleChange} placeholder="শহর" className="input" />
              <input name="zipCode" onChange={handleChange} placeholder="ZIP" className="input" />
            </div>

            <input name="email" onChange={handleChange} placeholder="ইমেইল" className="input" />

            <div className="flex gap-3">
              <button type="button" onClick={() => setDeliveryArea("inside")} className={`btn ${deliveryArea === "inside" ? "active" : ""}`}>
                ঢাকা (৳70)
              </button>

              <button type="button" onClick={() => setDeliveryArea("outside")} className={`btn ${deliveryArea === "outside" ? "active" : ""}`}>
                বাইরে (৳120)
              </button>
            </div>

            <button className="w-full bg-white text-black py-4 font-bold">
              অর্ডার কনফার্ম করুন
            </button>

          </form>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 bg-[#171717] p-6 border border-gray-800">

          <h2 className="text-xl mb-6">অর্ডার সামারি</h2>

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
                className="w-20 h-24 object-cover"
              />

              <div className="flex-1">
                <p>{item.name}</p>
                <p className="text-sm text-gray-400">Qty: {item.qty}</p>
              </div>

              <p>৳{item.price * item.qty}</p>

            </div>
          ))}

          <div className="border-t pt-4 space-y-2">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>৳{shippingCharge}</span>
            </div>

            <div className="flex justify-between text-xl font-bold">
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
        }
        .btn {
          padding: 10px 16px;
          border: 1px solid #444;
        }
        .active {
          background: white;
          color: black;
        }
      `}</style>

    </div>
  );
};

export default CheckoutPage;