import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MoveRight } from "lucide-react";
import combo from '../../../../../public/combo.png'
gsap.registerPlugin(ScrollTrigger);

const featuredData = [
  {
    id: 1,
    type: "product-large",
    title: "The Royal 5-Piece Combo",
    description: "আপনার পছন্দের ৫টি প্রিমিয়াম সুগন্ধি এখন একটি রাজকীয় বক্সে। উপহার হিসেবে সেরা পছন্দ।",
    image: {combo},
    tag: "Exclusive Offer"
  },
  {
    id: 2,
    type: "text-only",
    title: "The Essence of Luxury",
    description: "জাইন পারিউম অয়েলের প্রতিটি ড্রপ তৈরি হয় অত্যন্ত নিখুঁতভাবে। আমরা বিশ্বাস করি সুগন্ধি শুধু একটি ঘ্রাণ নয়, এটি আপনার ব্যক্তিত্বের প্রতিফলন।",
    tag: "Our Philosophy"
  },
  {
    id: 3,
    type: "product-small",
    title: "Creed Aventus",
    description: "আভিজাত্য এবং শক্তির এক অনন্য সংমিশ্রণ। আমাদের টপ সেলিং কালেকশন।",
     image: {combo},
    tag: "Signature Scent"
  }
];

export const FeaturedSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // ScrollTrigger রিফ্রেশ নিশ্চিত করা
    ScrollTrigger.refresh();

    let ctx = gsap.context(() => {
      gsap.from(".reveal-card", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%", // যখন সেকশনের টপ স্ক্রিনের ৮৫% এ আসবে
          end: "bottom 20%",
          toggleActions: "play none none reverse", 
          // markers: true, // এটি অন করে চেক করতে পারেন ট্রিগার পয়েন্ট কোথায় আছে
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill()); // সব ট্রিগার কিল করা যাতে মেমরি লিক না হয়
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-24 px-6 overflow-hidden min-h-screen">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {featuredData.map((item) => (
            <div 
              key={item.id}
              className={`reveal-card ${
                item.type === "product-large" ? "md:col-span-8 min-h-[500px]" : "md:col-span-4 min-h-[400px]"
              } relative group overflow-hidden border border-white/10 ${
                item.type === "text-only" ? "bg-[#0A0A0A]" : "bg-neutral-900"
              } flex flex-col justify-end p-10 transition-all duration-500 hover:border-white/30`}
            >
              {item.image && (
                <>
                  <img 
                    src={item.image.combo} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[1.5s]"
                    alt={item.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                </>
              )}
              
              <div className="relative z-10 space-y-4">
                <span className="text-[9px] -[0.4em] text-white/60 uppercase border-l border-white/30 pl-3">
                  {item.tag}
                </span>
                <h3 className="text-4xl font-serif text-white -wide uppercase">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm max-w-sm font-light leading-relaxed">
                  {item.description}
                </p>
                
                {item.type !== "text-only" && (
                  <button className="flex items-center gap-4 text-[10px] -[0.3em] text-white font-bold uppercase transition-all hover:gap-6 border-b border-white/10 pb-2 w-fit">
                    এখনই দেখুন <MoveRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};