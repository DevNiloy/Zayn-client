import  { useState } from 'react';
import { 
  Search, Edit3, Trash2, Package, 
  Loader2, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import { useDeleteProductMutation, useGetAllProductsQuery } from '@/redux/api/productApi';

function ProductList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // ডেটা ফেচিং
  const { data, isLoading,  } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  // সার্চ ফিল্টার লজিক 🕵️‍♂️
  const filteredProducts = data?.data?.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ডিলিট হ্যান্ডলার
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire('Deleted!', 'Product has been removed.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete product', 'error');
      }
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* উপরের অংশ: টাইটেল এবং সার্চবার */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Package className="text-indigo-600" /> INVENTORY
            </h1>
            <p className="text-sm text-gray-500 font-medium">Manage and monitor your products</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search products by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
            />
          </div>
        </div>

        {/* প্রোডাক্ট টেবিল 📋 */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Product</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Price</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Stock</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts?.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`http://localhost:5000${product.images[0]}`} 
                          alt={product.title}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                        />
                        <span className="font-bold text-gray-700 line-clamp-1">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
                         {/* ক্যাটাগরি পপুলেট করা থাকলে নাম দেখাবে, না থাকলে আইডি */}
                         {/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                         {typeof product.category === 'object' ? (product.category as any).name : 'Category'}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      ৳{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${product.stockQuantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {product.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {/* এডিট বাটন 🔄 */}
                        <button 
                          onClick={() => navigate(`/adminpannel/edit-product/${product._id}`)}
                          className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        {/* ডিলিট বাটন 🗑️ */}
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* যদি কোনো প্রোডাক্ট না পাওয়া যায় */}
          {filteredProducts?.length === 0 && (
            <div className="p-20 text-center">
              <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-bold">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;