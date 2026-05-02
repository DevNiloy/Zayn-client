import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import banner from "../../../../../public/banner1.png";

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      imageRef.current,
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: "power2.out" }
    ).fromTo(
      textRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" },
      "-=1.8"
    );

    gsap.to(rippleRef.current, {
      scale: 1.15,
      opacity: 0.2,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(imageRef.current, {
      scale: 1.15,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center bg-[#020202] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img
          ref={imageRef}
          src={banner}
          alt="Luxury Perfume"
          className="w-full h-full object-cover"
        />

        {/* ripple */}
        <div
          ref={rippleRef}
          className="absolute w-[120vw] h-[120vw] border border-white/5 rounded-full opacity-10"
        />

        {/* 🔥 DARKNESS কমানো হয়েছে */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60"></div>
      </div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 text-center px-6 max-w-5xl">

        <div className="mb-10">
          <span className="text-[10px] -[0.6em] text-neutral-400 uppercase block mb-4">
            সুগন্ধির এক শিল্পকলা
          </span>
          <div className="h-px w-24 bg-white/10 mx-auto"></div>
        </div>

        <h1 className="font-serif text-5xl md:text-8xl text-white mb-10 -tight leading-none">
          বিলাসিতার নতুন সংজ্ঞা
        </h1>

        <p className="text-neutral-300 max-w-xl mx-auto text-sm md:text-lg font-light leading-relaxed mb-16">
          হাতে তৈরি প্রিমিয়াম পারফিউম অয়েল, যা আপনার ব্যক্তিত্বকে আরও অনন্য করে তোলে।
          <br />
          আমাদের এক্সক্লুসিভ কালেকশন আবিষ্কার করুন।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <Button className="bg-white text-black hover:bg-neutral-200 rounded-none px-14 py-7 text-xs -[0.2em] uppercase">
            কালেকশন দেখুন
          </Button>

          <button className="text-[11px] uppercase -[0.3em] text-white/70 border-b border-white/10 pb-2 hover:text-white">
            আমাদের গল্প
          </button>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;