import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import gsap from "gsap";

const products = [
  { id: 1, title: "Versace Eros", category: "Perfume Oil", price: 450, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500", note: "Fresh & Minty" },
  { id: 2, title: "Tom Ford Oud Wood", category: "Perfume Oil", price: 600, img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=500", note: "Dark & Woody" },
  { id: 3, title: "Dior Sauvage", category: "Perfume", price: 2200, img: "https://images.unsplash.com/photo-1588405863914-22d99d363984?q=80&w=500", note: "Sharp & Spicy" },
  { id: 4, title: "Creed Aventus", category: "Perfume Oil", price: 800, img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500", note: "King of Scents" },
  { id: 5, title: "Bleu de Chanel", category: "Perfume", price: 2500, img: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=500", note: "Classic & Elegant" },
  { id: 6, title: "Aqua de Gio", category: "Perfume Oil", price: 500, img: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=500", note: "Aquatic & Fresh" },
];

const categories = ["সবগুলো", "Perfume Oil", "Perfume"];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("সবগুলো");
  const [priceRange, setPriceRange] = useState([5000]);

  useEffect(() => {
    gsap.fromTo(".product-card", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }
    );
  }, [activeCategory]);

  return (
    // Background: Rich Charcoal Grey (#121212)
    <div className="min-h-screen bg-[#121212] text-white py-20 px-6 font-sans">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* বাম পাশের ফিল্টার সাইডবার: Deep Matte Grey (#1A1A1A) */}
        <aside className="md:col-span-3 space-y-12 hidden md:block bg-[#1d1d1d] border-r border-white/5 pr-10 py-10 px-8 -ml-6 rounded-2xl shadow-xl">
          <div>
            <h2 className="text-[11px] uppercase -[0.4em] text-white/50 mb-10 font-bold border-b border-white/5 pb-4">ফিল্টার</h2>
            <div className="space-y-8">
              <p className="text-xs uppercase -widest font-semibold text-white/80">কালেকশন</p>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] uppercase -widest cursor-pointer transition-all flex items-center gap-4 group ${
                      activeCategory === cat ? 'text-white' : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${activeCategory === cat ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)] scale-110' : 'bg-white/10 group-hover:bg-white/30'}`}></span>
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-4 border-t border-white/5">
            <p className="text-xs uppercase -widest font-semibold text-white/80">মূল্য (৳ {priceRange})</p>
            <Slider 
              defaultValue={[5000]} 
              max={5000} 
              onValueChange={(val) => setPriceRange(val)}
              className="w-full opacity-80" 
            />
            <div className="flex justify-between text-[10px] text-white/20 -widest font-mono uppercase">
              <span>৳০</span>
              <span>৳৫০০০</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-white/10 bg-transparent hover:bg-white hover:text-black text-[10px] -[0.2em] uppercase transition-all py-6 rounded-none font-bold">
            সব মুছুন
          </Button>
        </aside>

        {/* মেইন কন্টেন্ট */}
        <main className="md:col-span-9">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="space-y-3">
              <nav className="text-[10px] -[0.3em] text-white/20 uppercase flex gap-2">
                <span className="hover:text-white/50 cursor-pointer transition-colors">হোম</span> 
                <span className="text-white/10">/</span> 
                <span className="text-white/50">কালেকশন</span>
              </nav>
              <h1 className="text-5xl md:text-7xl font-serif -tighter text-white/90">Perfume Oils</h1>
            </div>
            
            <div className="flex items-center gap-4 border-b border-white/10 pb-3">
              <span className="text-[10px] text-white/30 uppercase -[0.2em]">সাজান:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[140px] border-none bg-transparent text-[10px] text-white/90 -widest uppercase focus:ring-0 h-auto p-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10 text-white selection:bg-white/10">
                  <SelectItem value="newest" className="text-[10px] uppercase -widest">নতুন পণ্য</SelectItem>
                  <SelectItem value="price-low" className="text-[10px] uppercase -widest">মূল্য: কম-বেশি</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          {/* প্রোডাক্ট গ্রিড */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {products
              .filter(p => activeCategory === "সবগুলো" || p.category === activeCategory)
              .map((product) => (
              <div key={product.id} className="product-card group cursor-pointer">
                {/* Image Container: Darker Charcoal (#0A0A0A) */}
                <div className="relative aspect-[3/4] bg-[#0A0A0A] overflow-hidden border border-white/[0.03] group-hover:border-white/10 transition-all duration-700 shadow-2xl">
                  <img 
                    src={product.img} 
                    className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                    alt={product.title}
                  />
                  <div className="absolute top-5 right-5 text-[10px] bg-black/40 backdrop-blur-xl px-4 py-1.5 border border-white/10 text-white/90 font-bold -widest">
                    ৳ {product.price}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between items-start px-1">
                  <div className="space-y-2">
                    <h3 className="text-white/90 font-medium text-lg -wide uppercase transition-colors group-hover:text-white">
                      {product.title}
                    </h3>
                    <p className="text-[10px] text-white/30 uppercase -[0.2em] font-medium italic">
                      {product.note}
                    </p>
                  </div>
                  <Heart size={18} className="text-white/10 group-hover:text-white/80 transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
            ))}
          </div>

          {/* প্যাগিনেশন */}
          <footer className="mt-32 pt-16 border-t border-white/5 flex justify-center items-center gap-14">
            <ChevronLeft size={22} className="text-white/20 cursor-pointer hover:text-white transition-all" />
            <div className="flex gap-10 text-[11px] -[0.4em] font-bold uppercase">
              <span className="text-white border-b border-white pb-2 cursor-default">01</span>
              <span className="text-white/20 hover:text-white cursor-pointer transition-colors pb-2 border-b border-transparent">02</span>
              <span className="text-white/20 hover:text-white cursor-pointer transition-colors pb-2 border-b border-transparent">03</span>
            </div>
            <ChevronRight size={22} className="text-white/20 cursor-pointer hover:text-white transition-all" />
          </footer>
        </main>
      </div>
    </div>
  );
}