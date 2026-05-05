
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = [
    { name: "গোপনীয়তা নীতি", href: "/privacy" },
    { name: "শিপিং পলিসি", href: "/shipping" },
    { name: "যোগাযোগ", href: "/contact" },
    { name: "আমাদের শোরুম", href: "/stores" },
  ];

  const socialLinks = [
    { icon: <MessageCircle size={18} />, href: "https://wa.me/yournumber" },
  ];

  // ক্লিক প্রিভেন্ট করার জন্য একটি ফাংশন (যেহেতু আপনি আপাতত ক্লিকেবল রাখতে চাচ্ছেন না)
  const handleClick = (e:any) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          
          {/* Logo Section */}
          <div className="mb-12 group cursor-default">
            <h2 className="text-4xl font-serif tracking-[0.5em] text-white transition-all duration-500 group-hover:tracking-[0.6em]">
              ZAYN
            </h2>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/40"></div>
              <p className="text-2xl font-serif text-white/60 italic leading-none">زين</p>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/40"></div>
            </div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mt-4 font-light">
              Luxury Perfume Oil Set
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-8 mb-16">
            {socialLinks.map((social, index) => (
              <Link to={""}
                key={index} 
                 
                onClick={handleClick}
                className="text-neutral-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
              >
                {social.icon}
              </Link>
            ))}
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-20">
            {footerLinks.map((link) => (
               <Link to={""}
                key={link.name} 
                 
                onClick={handleClick}
                className="text-[11px] tracking-[0.2em] text-neutral-400 hover:text-white transition-colors uppercase font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Bottom Divider & Copyright */}
          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
            <p>© ২০২৪ ZAYN পারফিউম অয়েলস</p>
            <span className="hidden md:block">|</span>
            <p className="italic">বিলাসিতা এবং আভিজাত্য আমাদের পরিচয়</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;