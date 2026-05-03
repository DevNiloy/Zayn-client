import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { clearCart, addToCart } from '@/redux/feature/cart/cartSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    email: ''
  });

  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');

  // --- Facebook Ads Direct Checkout Logic (Complete) ---
  useEffect(() => {
    const pId = searchParams.get('id');
    const pName = searchParams.get('name');
    const pPrice = searchParams.get('price');
    const pImg = searchParams.get('img');

    if (pId && pName && pPrice) {
      const isAlreadyInCart = items.find(item => item.id.toString() === pId.toString());
      if (!isAlreadyInCart) {
        dispatch(addToCart({
          id: pId,
          name: pName,
          price: Number(pPrice),
          qty: 1,
          img: pImg || '',
        }));
      }
    }
  }, [searchParams, dispatch, items]);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shippingCharge = deliveryArea === 'inside' ? 70 : 120;
  const grandTotal = subtotal + shippingCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      Swal.fire({
        title: 'ব্যাগ খালি!',
        text: 'অর্ডার করতে আগে ব্যাগে কিছু প্রোডাক্ট যোগ করুন।',
        icon: 'warning',
        confirmButtonColor: '#1d1d1d',
        background: '#1d1d1d',
        color: '#fff'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "আপনার অর্ডারটি আমরা গ্রহণ করতে যাচ্ছি।",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#fff',
      cancelButtonColor: '#d33',
      confirmButtonText: '<span style="color:black">হ্যাঁ, অর্ডার দিন!</span>',
      cancelButtonText: 'বাতিল করুন',
      background: '#1d1d1d',
      color: '#fff'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'অর্ডার প্রসেস হচ্ছে...',
        didOpen: () => { Swal.showLoading(); },
        background: '#1d1d1d',
        color: '#fff',
        allowOutsideClick: false
      });

      try {
        const orderPayload = {
          ...formData,
          products: items,
          shippingCharge,
          totalAmount: grandTotal,
          deliveryArea,
          orderDate: new Date().toLocaleString()
        };

        console.log("Final Order Data:", orderPayload);

        // Simulation for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        Swal.fire({
          title: 'অর্ডার সফল!',
          text: 'আপনার অর্ডারটি আমরা গ্রহণ করেছি।',
          icon: 'success',
          confirmButtonColor: '#1d1d1d',
          background: '#1d1d1d',
          color: '#fff'
        });

        dispatch(clearCart());
        navigate('/'); 
      } catch (error) {
        Swal.fire({ title: 'দুঃখিত!', text: 'অর্ডার করতে সমস্যা হয়েছে।', icon: 'error', background: '#1d1d1d', color: '#fff' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1d1d1d] text-white py-12 px-4 md:px-20 font-serif">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Section: Shipping Form */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl italic mb-8 border-b border-gray-800 pb-4">চেকআউট</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase text-gray-500 font-sans tracking-widest">আপনার নাম *</label>
                <input name="name" onChange={handleInputChange} type="text" placeholder="Abdullah" className="bg-transparent border border-gray-800 p-4 outline-none focus:border-gray-500 transition" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase text-gray-500 font-sans tracking-widest">ফোন নম্বর *</label>
                <input name="phone" onChange={handleInputChange} type="tel" placeholder="017XXXXXXXX" className="bg-transparent border border-gray-800 p-4 outline-none focus:border-gray-500 transition" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase text-gray-500 font-sans tracking-widest">পূর্ণ ঠিকানা *</label>
              <textarea name="address" onChange={handleInputChange} rows={2} placeholder="বাসা নং, রাস্তা নং, এলাকা..." className="bg-transparent border border-gray-800 p-4 outline-none focus:border-gray-500 transition" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase text-gray-500 font-sans tracking-widest">শহর *</label>
                <input name="city" onChange={handleInputChange} type="text" className="bg-transparent border border-gray-800 p-4 outline-none focus:border-gray-500 transition" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase text-gray-500 font-sans tracking-widest">জিপ কোড</label>
                <input name="zipCode" onChange={handleInputChange} type="text" className="bg-transparent border border-gray-800 p-4 outline-none focus:border-gray-500 transition" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase text-gray-500 font-sans tracking-widest">ইমেইল</label>
                <input name="email" onChange={handleInputChange} type="email" placeholder="example@mail.com" className="bg-transparent border border-gray-800 p-4 outline-none focus:border-gray-500 transition" />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase text-gray-500 font-sans tracking-widest">ডেলিভারি এলাকা</p>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setDeliveryArea('inside')} className={`p-4 border transition text-sm ${deliveryArea === 'inside' ? 'border-white bg-zinc-800 shadow-lg' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>ঢাকার ভেতরে (৳৭০)</button>
                <button type="button" onClick={() => setDeliveryArea('outside')} className={`p-4 border transition text-sm ${deliveryArea === 'outside' ? 'border-white bg-zinc-800 shadow-lg' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>ঢাকার বাইরে (৳১২০)</button>
              </div>
            </div>

            <button type="submit" className="w-full bg-white text-black py-5 font-bold uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 transform active:scale-[0.98]">
              অর্ডার সম্পন্ন করুন
            </button>
          </form>
        </div>

        {/* Right Section: Large Order Summary */}
        <div className="lg:col-span-5 bg-[#171717] p-6 md:p-8 border border-gray-800 h-fit sticky top-10">
          <h2 className="text-xl italic mb-6 border-b border-gray-800 pb-2">অর্ডার সামারি</h2>
          
          <div className="space-y-6 mb-8 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
            {items.length > 0 ? items.map((item) => (
              <div key={item.id} className="flex gap-6 items-center border-b border-zinc-900 pb-6 last:border-0 group">
                {/* Product Image - Large & Clear */}
                <div className="w-24 h-32 md:w-28 md:h-36 bg-zinc-900 flex-shrink-0 overflow-hidden border border-gray-800 relative">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />
                  <div className="absolute top-0 right-0 bg-white text-black px-2 py-1 text-[10px] font-bold">x{item.qty}</div>
                </div>
                
                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between h-32 md:h-36">
                   <div>
                     <h3 className="text-lg font-medium leading-tight mb-2 group-hover:text-yellow-500 transition">{item.name}</h3>
                     <p className="text-[10px] text-gray-500 uppercase tracking-widest font-sans">Unit Price: ৳{item.price}</p>
                   </div>
                   <p className="text-xl font-sans text-white font-semibold">৳{(item.price * item.qty).toLocaleString('bn-BD')}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-600 text-center py-10 italic font-sans tracking-wider">আপনার ব্যাগটি বর্তমানে খালি</p>
            )}
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-800 text-xs text-gray-400 uppercase tracking-tighter font-sans">
            <div className="flex justify-between"><span>সাবটোটাল</span><span className="text-white">৳{subtotal.toLocaleString('bn-BD')}</span></div>
            <div className="flex justify-between"><span>শিপিং চার্জ</span><span className="text-white">৳{shippingCharge}</span></div>
            <div className="flex justify-between text-white text-2xl italic pt-6 border-t border-zinc-800 mt-4">
              <span className="not-italic font-sans font-light text-sm tracking-[4px]">TOTAL</span>
              <span className="text-yellow-500 not-italic font-bold">৳{grandTotal.toLocaleString('bn-BD')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #171717; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #666; }
      `}</style>
    </div>
  );
};

export default CheckoutPage;