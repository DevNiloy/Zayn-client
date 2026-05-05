import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Layers, 
  FolderPlus, 
  Image as ImageIcon,
  Loader2,
  Globe,
  X
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  useGetNestedCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation
} from '@/redux/api/categoryApi';

const BASE_URL = "http://localhost:5000"; 

const AddCategory = () => {
  // --- ১. এপিআই হুকস ---
  const { data: categoriesData, isLoading: isFetching } = useGetNestedCategoriesQuery();
  const [createCategory, { isLoading: isCreatingCat }] = useCreateCategoryMutation();
  const [createSubCategory, { isLoading: isCreatingSub }] = useCreateSubCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  // --- ২. স্টেট ম্যানেজমেন্ট ---
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState<File | null>(null);
  const [catPreview, setCatPreview] = useState<string | null>(null);

  const [subCatName, setSubCatName] = useState('');
  const [parentCatId, setParentCatId] = useState('');
  const [subCatImage, setSubCatImage] = useState<File | null>(null);
  // const [subPreview, setSubPreview] = useState<string | null>(null);
console.log(categoriesData)
  // ইমেজ প্রিভিউ হ্যান্ডলার
  const handleImageChange = (file: File | undefined, type: 'main' | 'sub') => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'main') {
        setCatImage(file);
        setCatPreview(reader.result as string);
      } else {
        setSubCatImage(file);
        // setSubPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- ৩. হ্যান্ডলার ফাংশনস ---

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return Swal.fire('Error', 'নাম দিতে হবে', 'error');

    const formData = new FormData();
    formData.append('name', catName);
    if (catImage) formData.append('image', catImage);

    try {
      await createCategory(formData).unwrap();
      setCatName('');
      setCatImage(null);
      setCatPreview(null);
      Swal.fire({ icon: 'success', title: 'সফল হয়েছে', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    } catch (err: any) {
      Swal.fire('Error', err.data?.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCatName || !parentCatId) return Swal.fire('Error', 'সব তথ্য পূরণ করুন', 'warning');

    const formData = new FormData();
    formData.append('name', subCatName);
    formData.append('category', parentCatId);
    if (subCatImage) formData.append('image', subCatImage);

    try {
      await createSubCategory(formData).unwrap();
      setSubCatName('');
      setParentCatId('');
      setSubCatImage(null);
      // setSubPreview(null);
      Swal.fire({ icon: 'success', title: 'সাব-ক্যাটাগরি তৈরি হয়েছে', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    } catch (err: any) {
      Swal.fire('Error', err.data?.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDelete = async (id: string, type: 'main' | 'sub') => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: type === 'main' ? "এটি ডিলিট করলে এর সাব-ক্যাটাগরিগুলোও মুছে যাবে!" : "এটি স্থায়ীভাবে মুছে ফেলা হবে।",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1F5E3B',
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন'
    });

    if (result.isConfirmed) {
      try {
        if (type === 'main') await deleteCategory(id).unwrap();
        else await deleteSubCategory(id).unwrap();
        Swal.fire('মুছে ফেলা হয়েছে!', '', 'success');
      } catch (err: any) {
        Swal.fire('এরর', err.data?.message || 'ডিলিট করা যায়নি', 'error');
      }
    }
  };

  return (
    <div className="w-full px-4 md:px-10 py-8 space-y-10 bg-[#FAFAFA] min-h-screen">
      {/* হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white shadow-sm rounded-2xl text-[#1F5E3B] border border-gray-100">
            <Layers size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Category Hub</h1>
            <p className="text-gray-500 font-medium">Manage your products hierarchy effortlessly</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* বাম পাশ: ফর্মসমূহ */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Main Category Form */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="flex items-center gap-2 font-black text-gray-800 mb-6 uppercase text-sm tracking-widest">
              <PlusCircle size={18} className="text-[#1F5E3B]" /> Create Category
            </h2>
            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Category Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#1F5E3B] outline-none transition-all font-bold text-gray-700"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Electronics"
                />
              </div>

              <div className="relative group overflow-hidden bg-gray-50 aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1F5E3B] transition-all flex flex-col items-center justify-center">
                {catPreview ? (
                  <div className="relative w-full h-full">
                    <img src={catPreview} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" onClick={() => {setCatPreview(null); setCatImage(null)}} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X size={14}/></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ImageIcon size={32} strokeWidth={1.5} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Upload Thumbnail</span>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e.target.files?.[0], 'main')} />
              </div>

              <button disabled={isCreatingCat} className="w-full bg-[#1F5E3B] text-white py-4 rounded-2xl font-black hover:shadow-xl hover:shadow-green-100 transition-all flex justify-center items-center gap-2">
                {isCreatingCat ? <Loader2 className="animate-spin" /> : 'SAVE CATEGORY'}
              </button>
            </form>
          </section>

          {/* Sub Category Form */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="flex items-center gap-2 font-black text-gray-800 mb-6 uppercase text-sm tracking-widest">
              <FolderPlus size={18} className="text-[#1F5E3B]" /> Create Sub-Category
            </h2>
            <form onSubmit={handleCreateSubCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Parent Category</label>
                <select 
                  value={parentCatId}
                  onChange={(e) => setParentCatId(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#1F5E3B] outline-none transition-all font-bold text-gray-700 appearance-none"
                >
                  <option value="">Select Category</option>
                  {categoriesData?.data?.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Sub-Category Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#1F5E3B] outline-none transition-all font-bold text-gray-700"
                  value={subCatName}
                  onChange={(e) => setSubCatName(e.target.value)}
                />
              </div>
              
              <button disabled={isCreatingSub} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all flex justify-center items-center gap-2">
                {isCreatingSub ? <Loader2 className="animate-spin" /> : 'ADD SUB-CATEGORY'}
              </button>
            </form>
          </section>
        </div>

        {/* ডান পাশ: লাইভ ইনভেন্টরি */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-[#1F5E3B]" />
                <h2 className="font-black text-gray-800 uppercase tracking-tight">Active Inventory</h2>
              </div>
              {isFetching && <Loader2 className="animate-spin text-[#1F5E3B]" size={20} />}
            </div>

            <div className="divide-y divide-gray-100">
              {categoriesData?.data?.length === 0 && (
                <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">No Categories Found</div>
              )}
              
              {categoriesData?.data?.map((cat: any) => (
                <div key={cat._id} className="p-8 hover:bg-gray-50/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                        {cat.image ? (
                          <img src={`${BASE_URL}${cat.image}`} className="w-full h-full object-cover" alt={cat.name} />
                        ) : (
                          <ImageIcon className="text-gray-200" size={30} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-xl uppercase tracking-tighter">{cat.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-[#1F5E3B]/10 text-[#1F5E3B] px-3 py-1 rounded-full font-black uppercase">Main</span>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-black uppercase">ID: {cat._id.slice(-6)}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(cat._id, 'main')}
                      className="p-4 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                  
                  {/* নেস্টেড সাব-ক্যাটাগরি লিস্ট */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="ml-24 mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cat.subcategories.map((sub: any) => (
                        <div key={sub._id} className="flex items-center justify-between bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-[#1F5E3B]/30 transition-all group/sub">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-50">
                              {sub.image ? <img src={`${BASE_URL}${sub.image}`} className="w-full h-full object-cover" alt="" /> : <Layers size={14} className="text-gray-300"/>}
                            </div>
                            <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{sub.name}</span>
                          </div>
                          <button 
                            onClick={() => handleDelete(sub._id, 'sub')}
                            className="text-gray-200 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddCategory;