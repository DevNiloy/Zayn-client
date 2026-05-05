import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  // Changed to reflect "Edit"
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
  Loader2,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useGetNestedCategoriesQuery } from "@/redux/api/categoryApi";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";

const EditProduct = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();

  // এপিআই কলস 🔌
  const { data: product, isLoading: isProductLoading } =
    useGetProductDetailsQuery(id as string);
  console.log(product);
  const { data: categoriesData } = useGetNestedCategoriesQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // স্টেট ম্যানেজমেন্ট
  const [formData, setFormData] = useState<any>({
    title: "",
    desc: "",
    price: "",
    discountPrice: "",
    category: "",
    subCategory: "",
    stockQuantity: "",
    stock: "available",
    bestSeller: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // ডেটা লোড হলে ফিল্ডে ভ্যালু বসানো 📥
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        desc: product.desc || "",
        price: product.price || "",
        discountPrice: product.discountPrice || "",
        category: product.category?._id || "",
        subCategory: product.subCategory?._id || "",
        stockQuantity: product.stockQuantity || "",
        stock: product.stock || "available",
        bestSeller: product.bestSeller || false,
      });
      setExistingImages(product.images || []);
    }
  }, [product]);
  console.log(formData);
  console.log(product);
  // ক্যাটাগরি অনুযায়ী সাব-ক্যাটাগরি ফিল্টার 🔍
  const selectedCat = useMemo(() => {
    return categoriesData?.data?.find((c: any) => c._id === formData.category);
  }, [formData.category, categoriesData]);

  // হ্যান্ডলার ফাংশন ⌨️
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subCategory: "" } : {}),
    }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length + existingImages.length > 5) {
      return Swal.fire("Limit Exceeded", "Maximum 5 images allowed!", "error");
    }
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (imgUrl: string) => {
    setExistingImages(existingImages.filter((url) => url !== imgUrl));
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });
    data.append("existingImages", JSON.stringify(existingImages));
    images.forEach((file) => data.append("images", file));

    try {
      await updateProduct({ id: id as string, formData: data }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Product Updated!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/adminpannel/all-product");
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.data?.message || "Something went wrong!",
        "error",
      );
    }
  };

  if (isProductLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="mt-4 font-bold text-gray-500">Loading Product Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                Edit Product
              </h1>
              <p className="text-gray-500 font-medium">
                Modify existing product details
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {isUpdating ? (
              "Saving..."
            ) : (
              <>
                <Save size={20} /> Update Product
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
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-semibold text-gray-700"
                />
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee size={14} className="text-indigo-600" /> Price
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
                  Discount
                </label>
                <input
                  name="discountPrice"
                  type="number"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Database size={14} className="text-indigo-600" /> Stock Qty
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

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
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
                  {categoriesData?.data.map((cat: any) => (
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
                  {selectedCat?.subcategories?.map((sub: any) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Star
                      size={18}
                      fill={formData.bestSeller ? "currentColor" : "none"}
                    />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Best Seller</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="bestSeller"
                    checked={formData.bestSeller}
                    onChange={handleToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <ImageIcon size={14} className="text-indigo-600" /> Product
                Gallery
              </label>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Existing Images from Server */}
                {existingImages.map((src, index) => (
                  <div
                    key={`old-${index}`}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-50 shadow-sm"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}${src}`}
                      className="w-full h-full object-cover"
                      alt="Old"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(src)}
                      className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {/* New Previews */}
                {previews.map((url, i) => (
                  <div
                    key={url}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-100 shadow-sm"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {existingImages.length + images.length < 5 && (
                <div className="relative group border-4 border-dashed border-gray-50 rounded-2xl p-6 hover:border-indigo-100 transition-all text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="mx-auto text-indigo-200" size={32} />
                  <p className="text-xs font-bold text-gray-400 mt-2">
                    Add More Images
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="md:hidden w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold transition-all shadow-lg"
            >
              {isUpdating ? (
                "Updating..."
              ) : (
                <>
                  <Save size={20} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
