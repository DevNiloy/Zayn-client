import React, { useState } from "react";
import {
  PackagePlus,
  Image as ImageIcon,
  Tag,
  Layers,
  Database,
  Type,
  AlignLeft,
  X,
  IndianRupee,
  Save,
  Star,
  BadgePercent,
} from "lucide-react";

import Swal from "sweetalert2";
import { useGetNestedCategoriesQuery } from "@/redux/api/categoryApi";
import { useCreateProductMutation } from "@/redux/api/productApi";

// --- Types ---
interface IFormData {
  title: string;
  desc: string;
  price: string;
  discountPrice: string;
  category: string;
  subCategory: string;
  stockQuantity: string;
  stock: "available" | "out of stock";
  isBestSeller: boolean;
}

function AddProduct() {
  // এপিআই হুকস 🔌
  const { data: categoriesData } = useGetNestedCategoriesQuery();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const initialState: IFormData = {
    title: "",
    desc: "",
    price: "",
    discountPrice: "",
    category: "",
    subCategory: "",
    stockQuantity: "",
    stock: "available",
    isBestSeller: false,
  };
  // স্টেট ম্যানেজমেন্ট 🏗️
  const [formData, setFormData] = useState<IFormData>({
    title: "",
    desc: "",
    price: "",
    discountPrice: "",
    category: "",
    subCategory: "",
    stockQuantity: "",
    stock: "available",
    isBestSeller: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // ইনপুট হ্যান্ডলার ⌨️
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // ক্যাটাগরি চেঞ্জ হলে সাব-ক্যাটাগরি রিসেট হবে
      ...(name === "category" ? { subCategory: "" } : {}),
    }));
  };

  // টগল হ্যান্ডলার (Best Seller এর জন্য) ⚡
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  // ইমেজ হ্যান্ডলার 🖼️
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // ইমেজ রিমুভ ❌
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // সাবমিট হ্যান্ডলার 🚀
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ভ্যালিডেশন: ডিসকাউন্ট প্রাইস কি মেইন প্রাইসের চেয়ে বেশি?
    if (Number(formData.discountPrice) >= Number(formData.price)) {
      return Swal.fire(
        "Error",
        "Discount price should be less than regular price",
        "error",
      );
    }

    const data = new FormData();
    // সব টেক্সট এবং বুলিয়ান ডেটা অ্যাপেন্ড করা
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });
    // ইমেজগুলো অ্যাপেন্ড করা
    images.forEach((image) => data.append("images", image));

    try {
      await createProduct(data).unwrap();
      Swal.fire("Success", "Product added successfully!", "success");
      setFormData(initialState); // টেক্সট ফিল্ডগুলো রিসেট
      setImages([]); // ইমেজ ফাইলগুলো রিসেট
      setPreviews([]); // ইমেজের প্রিভিউগুলো রিসেট
      // -------------------------------------
    } catch (err) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const selectedCat = categoriesData?.data.find(
    (c) => c._id === formData.category,
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
              <PackagePlus size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                Add Product
              </h1>
              <p className="text-gray-500 font-medium">
                Create a new listing for your store
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save size={20} /> Publish Product
              </>
            )}
          </button>
        </div>

        <form
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          onSubmit={handleSubmit}
        >
          {/* Left Column: Core Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Basic Details Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Type size={14} className="text-indigo-600" /> Product Title
                </label>
                <input
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter product name..."
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-semibold text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <AlignLeft size={14} className="text-indigo-600" />{" "}
                  Description
                </label>
                <textarea
                  name="desc"
                  required
                  value={formData.desc}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your product details..."
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-semibold text-gray-700"
                />
              </div>
            </div>

            {/* Pricing & Stock Card 💸 */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee size={14} className="text-indigo-600" /> Regular
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <BadgePercent size={14} className="text-indigo-600" />{" "}
                  Discount Price
                </label>
                <input
                  name="discountPrice"
                  type="number"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Database size={14} className="text-indigo-600" /> Stock
                </label>
                <input
                  name="stockQuantity"
                  type="number"
                  required
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Categories & Features */}
          <div className="lg:col-span-4 space-y-6">
            {/* Category & Best Seller */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={14} className="text-indigo-600" /> Category
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-gray-700 appearance-none"
                >
                  <option value="">Select Category</option>
                  {categoriesData?.data.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers size={14} className="text-indigo-600" /> Sub-category
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  disabled={!formData.category}
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-gray-700 appearance-none disabled:opacity-50"
                >
                  <option value="">Select Sub-category</option>
                  {selectedCat?.subcategories?.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <hr className="border-gray-50" />

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Star
                      size={18}
                      fill={formData.isBestSeller ? "currentColor" : "none"}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">
                      Best Seller
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Feature on home
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <ImageIcon size={14} className="text-indigo-600" /> Product
                Gallery
              </label>
              <div className="relative group border-4 border-dashed border-gray-50 rounded-2xl p-8 hover:border-indigo-100 transition-all text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <ImageIcon className="mx-auto text-indigo-200" size={40} />
                  <p className="text-sm font-bold text-gray-400">
                    Click or drag images
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {previews.map((url, i) => (
                  <div
                    key={url}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-50 shadow-sm"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="md:hidden w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold transition-all shadow-lg"
            >
              {isLoading ? (
                "Publishing..."
              ) : (
                <>
                  <Save size={20} /> Publish Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
