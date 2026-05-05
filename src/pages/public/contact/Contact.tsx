import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-6 py-28">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-serif">যোগাযোগ করুন</h1>
        <p className="text-white/40 mt-6 text-sm md:text-base">
          আপনার যেকোনো প্রশ্ন, অর্ডার বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।
          আমরা সবসময় আপনার পাশে আছি।
        </p>
      </motion.div>

      {/* CONTENT */}
      <div className="mt-20 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

        {/* LEFT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <MapPin className="text-white/60" />
              <p>Jatrabari, Dhaka, Bangladesh - 1236</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Phone className="text-white/60" />
              <p>+880 1XXXXXXXXX</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Mail className="text-white/60" />
              <p>support@zayn.com</p>
            </div>
          </div>

          {/* FACEBOOK */}
          {/* <a
            href="https://www.facebook.com/zaynnbd"
            target="_blank"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            <Facebook size={18} />
            আমাদের Facebook Page
          </a> */}
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <h2 className="text-2xl font-serif mb-6">আমাদের মেসেজ পাঠান</h2>

          <form className="space-y-4">

            <input
              type="text"
              placeholder="আপনার নাম"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
            />

            <input
              type="email"
              placeholder="ইমেইল"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
            />

            <textarea
              rows={5}
              placeholder="আপনার মেসেজ লিখুন..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30"
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-white text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
            >
              Send Message <Send size={16} />
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}