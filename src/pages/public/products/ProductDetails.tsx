import { useState } from "react";
import { useDispatch } from "react-redux";
import { ShoppingCart, Minus, Plus, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/redux/feature/cart/cartSlice";

const productData = {
  id: "oud-noir-001",
  name: "Oud Noir",
  price: 4500,
  img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000",
  desc: "ওদ নোয়ার কেবল একটি সুগন্ধি নয়; এটি একটি আভিজাত্যের প্রতীক। যারা নীরবতার মাঝে শক্তি এবং বিলাসিতা খুঁজে পান, তাদের জন্যই এটি তৈরি।",
  topNotes: "জাফরান এবং গোলমরিচ",
  heartNotes: "রোজ এবং আগরউড (ওদ)",
  baseNotes: "লেদার এবং অ্যাম্বার",
  longevity: "১২ ঘণ্টা+",
  sillage: "প্রবল (Heavy)",
  intensity: "Profound (5/5)"
};

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      qty: quantity,
      img: productData.img,
      desc: productData.desc
    }));
    alert("পণ্যটি কার্টে যোগ করা হয়েছে!");
  };

  return (
    <div className="min-h-screen bg-[#1d1d1d] text-zinc-300 py-12 md:py-24 px-4 sm:px-6 font-sans selection:bg-zinc-700 selection:text-white overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-24">
          
          {/* Product Image Section: মোবাইলে হাইট অ্যাডজাস্ট করা হয়েছে */}
          <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-[#0D0D0D] overflow-hidden border border-white/[0.03] shadow-2xl rounded-sm">
            <img 
              src={productData.img} 
              alt={productData.name}
              className="w-full h-full object-cover opacity-90 transition-opacity duration-500 hover:opacity-100"
            />
            {/* Overlay Text: মোবাইলে সাইজ কমানো হয়েছে */}
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 space-y-2 md:space-y-3 bg-black/30 backdrop-blur-md p-4 md:p-6 border border-white/5 max-w-[80%]">
              <span className="text-[9px] md:text-[11px] uppercase text-zinc-400 font-bold tracking-widest">Private Collection</span>
              <h2 className="text-2xl md:text-5xl font-serif italic text-white leading-tight">The Dark Alchemy</h2>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-5 space-y-8 md:space-y-12 py-2 md:py-6">
            <div className="space-y-4 md:space-y-6">
              <nav className="text-[10px] md:text-[11px] text-zinc-500 uppercase flex gap-2 font-medium tracking-widest">
                <span>হোম</span> 
                <span>/</span> 
                <span className="text-zinc-400">কালেকশন</span>
              </nav>
              <h1 className="text-5xl md:text-7xl font-serif text-zinc-100 leading-none">{productData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                <span className="text-2xl md:text-3xl font-medium text-white font-mono">৳ {productData.price}</span>
                <span className="text-[9px] md:text-[10px] text-zinc-400 uppercase border border-zinc-700 px-3 py-1.5 rounded-sm tracking-tighter">ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>

            {/* Scent Architecture: মোবাইলে ২ কলামে ভেঙে যাবে না, গ্রিড ঠিক করা হয়েছে */}
            <div className="space-y-6 md:space-y-8 border-t border-zinc-800/50 pt-8 md:pt-12">
              <h3 className="text-[11px] md:text-[12px] uppercase text-zinc-400 font-bold tracking-[0.2em]">সুগন্ধির গঠন</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-black/10 py-6 border-b border-zinc-800/50">
                <div className="space-y-2 md:space-y-3">
                  <p className="text-[9px] md:text-[10px] uppercase text-zinc-500 font-bold tracking-widest">টপ নোট</p>
                  <p className="text-[12px] md:text-[13px] text-zinc-200 font-medium leading-relaxed">{productData.topNotes}</p>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <p className="text-[9px] md:text-[10px] uppercase text-zinc-500 font-bold tracking-widest">হার্ট নোট</p>
                  <p className="text-[12px] md:text-[13px] text-zinc-200 font-medium leading-relaxed">{productData.heartNotes}</p>
                </div>
                <div className="space-y-2 md:space-y-3 col-span-2 sm:col-span-1">
                  <p className="text-[9px] md:text-[10px] uppercase text-zinc-500 font-bold tracking-widest">বেস নোট</p>
                  <p className="text-[12px] md:text-[13px] text-zinc-200 font-medium leading-relaxed">{productData.baseNotes}</p>
                </div>
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-4 md:space-y-6 pt-2">
              <div className="flex justify-between text-[10px] md:text-[11px] uppercase text-zinc-400 font-bold tracking-widest">
                <span>তীব্রতা (Intensity)</span>
                <span className="text-zinc-200 font-mono">{productData.intensity}</span>
              </div>
              <div className="h-1 w-full bg-zinc-800 rounded-full">
                <div className="h-full w-[85%] bg-zinc-500 rounded-full"></div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-8 md:space-y-10 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <span className="text-[11px] uppercase text-zinc-500 font-bold tracking-widest">পরিমাণ:</span>
                <div className="flex items-center border border-zinc-700 bg-black/20 rounded-md overflow-hidden w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 md:p-5 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 md:w-16 text-center text-base md:text-lg font-mono font-bold text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 md:p-5 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-zinc-100 text-black hover:bg-white rounded-md py-6 md:py-8 text-[12px] md:text-[13px] uppercase font-bold tracking-[0.3em] transition-all shadow-xl active:scale-[0.98]"
                >
                  <ShoppingCart className="mr-3 h-4 w-4 md:h-5 md:w-5" /> কার্টে যোগ করুন
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-zinc-700 bg-transparent rounded-md py-6 md:py-8 text-[10px] md:text-[11px] uppercase hover:bg-zinc-800 hover:text-white transition-all text-zinc-500 tracking-widest"
                >
                  ফ্রি স্যাম্পল রিকোয়েস্ট
                </Button>
              </div>

              <div className="flex flex-wrap justify-between gap-4 pt-4 text-[9px] md:text-[10px] text-zinc-500 uppercase font-semibold tracking-widest">
                <span className="flex items-center gap-2 md:gap-3"><ShieldCheck size={14} /> ১০০% অরিজিনাল</span>
                <span className="flex items-center gap-2 md:gap-3"><Globe size={14} /> গ্লোবাল শিপিং</span>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section: মোবাইলে স্পেসিং ঠিক করা হয়েছে */}
        <div className="mt-24 md:mt-48 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center border-t border-zinc-800/50 pt-16 md:pt-32 pb-10">
          <div className="aspect-[4/3] bg-[#0D0D0D] overflow-hidden border border-zinc-800/50 shadow-2xl rounded-sm group order-2 lg:order-1">
             <img 
               src="https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=1000" 
               className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000" 
               alt="heritage" 
             />
          </div>
          
          <div className="space-y-6 md:space-y-10 order-1 lg:order-2">
            <span className="text-[11px] md:text-[12px] uppercase text-zinc-500 font-bold italic border-l-2 border-zinc-700 pl-4 md:pl-6 tracking-widest">The Experience</span>
            <h2 className="text-3xl md:text-6xl font-serif italic leading-tight text-zinc-100 text-balance">ছায়া এবং রূপার মাঝে লেখা এক সুরের মূর্ছনা।</h2>
            <p className="text-zinc-400 leading-relaxed font-normal text-lg md:text-xl max-w-xl">
               এটি একটি আধুনিক ক্লাসিক যা আপনার চারপাশের পরিবেশে এক মায়াবী আবেশ তৈরি করে। এর প্রতিটি ফোঁটা আপনাকে নিয়ে যাবে এক রহস্যময় সফরে।
            </p>
            
            <div className="grid grid-cols-2 gap-6 md:gap-12 pt-8 md:pt-12 border-t border-zinc-800/50">
              <div className="space-y-2 md:space-y-4">
                <p className="text-3xl md:text-5xl font-serif text-zinc-100">{productData.longevity}</p>
                <p className="text-[10px] md:text-[11px] uppercase text-zinc-500 font-bold tracking-widest">স্থায়িত্ব</p>
              </div>
              <div className="space-y-2 md:space-y-4">
                <p className="text-3xl md:text-5xl font-serif text-zinc-100">{productData.sillage}</p>
                <p className="text-[10px] md:text-[11px] uppercase text-zinc-500 font-bold tracking-widest">সিলিয়েজ</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}