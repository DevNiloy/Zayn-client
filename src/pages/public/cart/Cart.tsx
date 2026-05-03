import { removeFromCart, updateQuantity } from '@/redux/feature/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = 0; 
  const grandTotal = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#1d1d1d] text-white py-12 px-4 md:px-20 font-serif">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl italic mb-2">আপনার ব্যাগ - জাইন</h1>
        <p className="text-gray-400 uppercase text-xs">ইন্দ্রিয়ের জন্য এক অনন্য আয়োজন</p>
      </div>

      <div className="max-w-5xl mx-auto border-t border-gray-800">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-center py-10 border-b border-gray-800 gap-8">
              {/* Product Image */}
              <div className="w-40 h-48 bg-zinc-900 overflow-hidden shrink-0">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" 
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl mb-1">{item.name}</h2>
                <p className="text-gray-500 text-sm mb-6">অয়েল • কনসেনট্রেটেড অয়েল</p>
                
                <div className="flex items-center justify-center md:justify-start gap-6">
                  <div className="flex items-center border border-gray-700">
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, delta: -1 }))}
                      className="p-2 hover:bg-zinc-800 transition"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="px-4 py-1 text-lg">{item.qty}</span>
                    
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, delta: 1 }))}
                      className="p-2 hover:bg-zinc-800 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-gray-500 hover:text-red-400 text-xs uppercase flex items-center gap-1"
                  >
                    <Trash2 size={14} /> মুছে ফেলুন
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-xl">
                ৳{(item.price * item.qty).toLocaleString('bn-BD')}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 uppercase mb-6">আপনার ব্যাগটি খালি</p>
            <button 
              onClick={() => navigate('/shop')}
              className="px-8 py-3 border border-gray-700 hover:bg-white hover:text-black transition uppercase text-xs"
            >
              কেনাকাটা শুরু করুন
            </button>
          </div>
        )}

        {/* Summary Section */}
        {items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Brand Promise */}
            <div className="text-gray-400 text-sm space-y-4">
              <h3 className="text-white italic text-lg">জাইন-এর প্রতিশ্রুতি</h3>
              <p className="leading-relaxed">
                প্রতিটি অয়েল আমাদের নিজস্ব অ্যাটেলিয়ারে হাতে ঢালা হয়। 
                শিপিংয়ের আগে ৩-৫ দিন সময় দিন যাতে আমরা নিখুঁতভাবে আপনার পারফিউমটি প্রস্তুত করতে পারি।
              </p>
            </div>

            {/* Totals */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm uppercase text-gray-400">
                <span>সাবটোটাল</span>
                <span className="text-white">৳{subtotal.toLocaleString('bn-BD')}</span>
              </div>
              <div className="flex justify-between text-sm uppercase text-gray-400">
                
              </div>
              <div className="border-t border-gray-800 pt-4 flex justify-between items-end">
                <span className="text-2xl italic">মোট</span>
                <span className="text-3xl text-yellow-500 font-light">
                  ৳{grandTotal.toLocaleString('bn-BD')}
                </span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-white text-black py-4 mt-6 uppercase font-bold hover:bg-gray-200 transition-colors"
              >
                চেকআউট করতে এগিয়ে যান
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;