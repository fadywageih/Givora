import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { dbProducts } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const { toast } = useToast();

  const initialForm = {
    name: '', category: '', sku: '', moq: 100, 
    retail_price: 0, wholesale_price: 0, stock_quantity: 0, 
    image_url: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => setProducts(dbProducts.getAll());

  const handleAddNew = () => {
    setFormData(initialForm);
    setCurrentProduct(null);
    setIsEditing(true);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    dbProducts.delete(id);
    loadProducts();
    setShowDeleteConfirm(null);
    toast({ title: "Deleted", description: "Product removed." });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentProduct) {
      dbProducts.update(currentProduct.id, formData);
      toast({ title: "Updated", description: "Product updated." });
    } else {
      dbProducts.create(formData);
      toast({ title: "Created", description: "New product added." });
    }
    setIsEditing(false);
    loadProducts();
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-6">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium mb-1">Name</label>
               <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Category</label>
               <input required name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">SKU</label>
               <input required name="sku" value={formData.sku} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">MOQ</label>
               <input type="number" required name="moq" value={formData.moq} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Retail Price</label>
               <input type="number" step="0.01" required name="retail_price" value={formData.retail_price} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Wholesale Price</label>
               <input type="number" step="0.01" required name="wholesale_price" value={formData.wholesale_price} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Stock</label>
               <input type="number" required name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Image URL</label>
               <input required name="image_url" value={formData.image_url} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://..." />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#0A1F44] text-white">Save Product</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Products - Admin</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0A1F44]">Product Management</h1>
        <Button onClick={handleAddNew} className="bg-[#0A1F44] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">SKU/Cat</th>
              <th className="p-4 font-semibold">Pricing</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center space-x-3">
                  <img src={p.image_url} alt="" className="w-10 h-10 rounded object-cover bg-gray-200" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-4 text-sm">
                  <p>{p.sku}</p>
                  <p className="text-gray-500">{p.category}</p>
                </td>
                <td className="p-4 text-sm">
                  <p>Retail: ${p.retail_price}</p>
                  <p className="text-gray-500">Wholesale: ${p.wholesale_price}</p>
                </td>
                <td className="p-4 text-sm">{p.stock_quantity}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(p)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setShowDeleteConfirm(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-lg font-bold text-[#0A1F44] mb-4">Delete Product?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDelete(showDeleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductManagement;