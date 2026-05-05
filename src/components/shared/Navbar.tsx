import { ShoppingBag, User, Menu, Search } from "lucide-react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { useGetMeQuery, useLogoutMutation } from "@/redux/api/authApi";

const links = [
  { name: "হোম", path: "/" },
  { name: "শপ", path: "/shop" },
  { name: "আমাদের সম্পর্কে", path: "/about" },
  // { name: "যোগাযোগ", path: "/contact" },
];

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          onClick={onClick}
          className={({ isActive }) =>
            `text-[14px] uppercase tracking-widest transition-all block py-2 ${
              isActive ? "text-white" : "text-neutral-400 hover:text-white"
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const { data: user } = useGetMeQuery();

  const cartItems = useSelector((state: any) => state.cart.items);

  // 🔥 SEARCH STATE
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/shop?keyword=${keyword}`);
    setKeyword("");
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between h-20 px-6 gap-4">

        {/* Logo */}
        <NavLink to="/" className="flex flex-col items-center leading-none shrink-0">
          <span className="text-2xl font-serif tracking-[0.3em] text-white">ZAYN</span>
          <span className="text-lg font-serif text-white/80 mt-1">زين</span>
        </NavLink>

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-10">

          {/* Links */}
          <div className="flex items-center gap-8">
            <NavLinks />
          </div>

          {/* SEARCH */}
          <div className="relative w-full max-w-[250px] mx-4 group">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors"
            />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              type="text"
              placeholder="Search perfumes..."
              className="w-full bg-white/5 border-white/10 rounded-full pl-10 h-9 text-xs text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/20"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 text-white/70">

          {/* CART */}
          <Link to="/cart">
            <button className="relative hover:text-white transition-colors cursor-pointer">
              <ShoppingBag size={20} strokeWidth={1} />

              {cartItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </Link>

          {/* USER */}
          <div className="hidden md:block">

            {user?.role === "ADMIN" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-white transition-colors flex items-center">
                    <User size={20} strokeWidth={1} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-black border border-white/10 text-white mt-2">
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="focus:bg-white/10 focus:text-white cursor-pointer text-red-400"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : user ? (
              <button className="hover:text-white transition-colors">
                <User size={20} strokeWidth={1} />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-xs uppercase tracking-widest hover:text-white"
              >
                Login
              </button>
            )}
          </div>

          {/* MOBILE */}
          <div className="md:hidden flex items-center gap-4">

            {user && (
              <button onClick={() => navigate("/dashboard")} className="hover:text-white">
                <User size={20} strokeWidth={1} />
              </button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <button className="text-white p-1">
                  <Menu size={24} />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="bg-black text-white border-l border-white/10 w-[300px]">

                <div className="mb-8 mt-4">
                  <span className="text-xl font-serif tracking-[0.3em]">ZAYN</span>
                </div>

                {/* SEARCH MOBILE */}
                <div className="relative mb-8 group">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white/5 border-white/10 rounded-lg pl-10 py-5 text-sm text-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <NavLinks />
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">

                  <Link to="/cart">
                    <button className="flex items-center gap-3 text-sm text-neutral-400 hover:text-white cursor-pointer">
                      <ShoppingBag size={18} />
                      Cart ({cartItems?.length || 0})
                    </button>
                  </Link>

                  {!user ? (
                    <button
                      onClick={() => navigate("/login")}
                      className="block text-sm text-neutral-400 hover:text-white"
                    >
                      Login
                    </button>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="block text-sm text-red-400 hover:text-red-300"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;