import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Globe, Heart,} from "lucide-react";
import { Link } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function About() {
  return (
 <div className="bg-[#0A0A0A]">
     <div className="min-h-screen container mx-auto bg-[#0A0A0A] text-white px-6 py-28">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center container mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-serif">
          আমাদের সম্পর্কে
        </h1>

        <p className="text-white/40 mt-6 text-sm md:text-base leading-relaxed">
          ZAYN হলো একটি প্রিমিয়াম পারফিউম ব্র্যান্ড, যেখানে প্রতিটি সুগন্ধ
          আপনার ব্যক্তিত্বকে আরও বিশেষ করে তোলে।
          আমরা বিশ্বাস করি — সুগন্ধ শুধু গন্ধ নয়, এটি একটি অনুভূতি।
        </p>
      </motion.div>

      {/* STORY */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-24 grid md:grid-cols-2 gap-10 items-center"
      >
        <motion.div variants={item} className="space-y-6">
          <h2 className="text-3xl font-serif">আমাদের গল্প</h2>

          <p className="text-white/50 leading-relaxed">
            ZAYN শুরু হয়েছে মানুষের লাইফস্টাইলকে আরও সুন্দর ও আত্মবিশ্বাসী
            করে তোলার লক্ষ্য নিয়ে। আমরা বিশ্বের বিভিন্ন দেশ থেকে
            প্রিমিয়াম পারফিউম সংগ্রহ করি এবং আপনাদের কাছে পৌঁছে দিই।
          </p>

          <p className="text-white/50">
            আমাদের উদ্দেশ্য শুধু প্রোডাক্ট বিক্রি করা না, বরং একটি luxury experience দেওয়া।
          </p>

          {/* LOCATION */}
          <div className="text-white/60 text-sm">
            📍 লোকেশন: Jatrabari, Dhaka, Bangladesh - 1236
          </div>

          {/* FACEBOOK */}
          <a
            href="https://www.facebook.com/zaynnbd"
            target="_blank"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            {/* <Facebook size={18} />
            আমাদের Facebook Page */}
          </a>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          variants={item}
          className="relative h-[350px] rounded-2xl overflow-hidden border border-white/10"
        >
          <img
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de"
            className="w-full h-full object-cover scale-110 hover:scale-100 transition duration-700"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </motion.div>

      {/* FEATURES */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-28 grid md:grid-cols-4 gap-6"
      >

        <motion.div variants={item} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Sparkles className="text-white/70 mb-3" />
          <h3 className="text-lg font-semibold">প্রিমিয়াম কোয়ালিটি</h3>
          <p className="text-white/40 text-sm mt-2">
            সেরা মানের অরিজিনাল পারফিউম সংগ্রহ করা হয়।
          </p>
        </motion.div>

        <motion.div variants={item} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <ShieldCheck className="text-white/70 mb-3" />
          <h3 className="text-lg font-semibold">বিশ্বাসযোগ্য ব্র্যান্ড</h3>
          <p className="text-white/40 text-sm mt-2">
            ১০০% অরিজিনাল ও যাচাইকৃত প্রোডাক্ট।
          </p>
        </motion.div>

        <motion.div variants={item} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Globe className="text-white/70 mb-3" />
          <h3 className="text-lg font-semibold">গ্লোবাল কালেকশন</h3>
          <p className="text-white/40 text-sm mt-2">
            ফ্রান্স, UAE, Italy সহ বিভিন্ন দেশ থেকে সংগ্রহ।
          </p>
        </motion.div>

        <motion.div variants={item} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <Heart className="text-white/70 mb-3" />
          <h3 className="text-lg font-semibold">ভালোবাসা দিয়ে তৈরি</h3>
          <p className="text-white/40 text-sm mt-2">
            প্রতিটি প্রোডাক্টে থাকে যত্ন ও dedication।
          </p>
        </motion.div>

      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-28 text-center"
      >
        <h2 className="text-3xl font-serif">ZAYN এর অনুভূতি অনুভব করুন</h2>
        <p className="text-white/40 mt-3">
          আপনার ব্যক্তিত্বকে আরও আকর্ষণীয় করে তুলুন
        </p>

        <Link to={'/shop'}>
        <button className="mt-6 px-8 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition">
          এখনই দেখুন
        </button></Link>
      </motion.div>

    </div>
 </div>
  );
}