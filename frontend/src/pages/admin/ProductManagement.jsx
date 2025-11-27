import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const initialForm = {
    name: '', category: '', sku: '', moq: 100,
    retailPrice: 0, wholesalePrice: 0, stockQuantity: 0,
    imageUrl: '', cloudinaryId: '', images: []
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await adminAPI.getProducts();
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setFormData(initialForm);
    setCurrentProduct(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setIsEditing(true);
  };

  const handleEdit = (product) => {
    const images = product.images || (product.imageUrl ? [{ imageUrl: product.imageUrl, cloudinaryId: product.cloudinaryId || null }] : []);
    setFormData({ ...product, images });
    setCurrentProduct(product);
    setSelectedImages([]);
    setImagePreviews([]);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await adminAPI.deleteProduct(id);
    await loadProducts();
    setShowDeleteConfirm(null);
    toast({ title: "Deleted", description: "Product removed." });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 3 || files.length > 5) {
      toast({ title: 'Invalid Selection', description: 'Please select between 3 and 5 images.', variant: 'destructive' });
    }
    const limited = files.slice(0, 5);
    setSelectedImages(limited);
    // create previews
    const readers = [];
    const previews = [];
    limited.forEach((file, idx) => {
      const reader = new FileReader();
      readers.push(reader);
      reader.onloadend = () => {
        previews[idx] = reader.result;
        if (previews.filter(Boolean).length === limited.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImagesUpload = async () => {
    if (!selectedImages || selectedImages.length === 0) return [];

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      selectedImages.forEach((file) => formDataUpload.append('images', file));

      const res = await adminAPI.uploadProductImages(formDataUpload);
      if (res.success) {
        toast({ title: 'Success', description: 'Images uploaded successfully!' });
        return res.data.images || [];
      }
      return [];
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to upload images', variant: 'destructive' });
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let finalFormData = { ...formData };
      // Upload images first if selected
      if (selectedImages && selectedImages.length > 0) {
        const uploadedImages = await handleImagesUpload();
        if (!uploadedImages.length || uploadedImages.length < 3) {
          toast({ title: 'Error', description: 'Please upload 3–5 images.', variant: 'destructive' });
          return;
        }
        finalFormData = { ...finalFormData, images: uploadedImages };
      }

      // For updates, if user cleared previews but didn't select new images,
      // avoid sending an empty images array (backend requires 3–5 when provided)
      if (currentProduct && selectedImages.length === 0 && Array.isArray(finalFormData.images) && finalFormData.images.length === 0) {
        const { images, ...rest } = finalFormData;
        finalFormData = rest;
      }

      if (currentProduct) {
        await adminAPI.updateProduct(currentProduct.id, finalFormData);
        toast({ title: "Updated", description: "Product updated." });
      } else {
        // Ensure images exist for creation
        const imgs = finalFormData.images || [];
        if (!imgs.length || imgs.length < 3) {
          toast({ title: 'Missing Images', description: 'New products require 3–5 images.', variant: 'destructive' });
          return;
        }
        await adminAPI.createProduct(finalFormData);
        toast({ title: "Created", description: "New product added." });
      }
      setIsEditing(false);
      await loadProducts();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  if (isEditing) {
      return (
      <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-medium mb-2">Product Images (3–5)</label>
            <div className="flex items-start gap-4">
              <div className="flex flex-wrap gap-2">
                {(imagePreviews.length > 0 ? imagePreviews : (formData.images || []).map(i => i.imageUrl)).map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} alt="Preview" className="w-24 h-24 object-cover rounded border" />
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedImages.length ? 'Change Images' : 'Upload Images'}
                </label>
                <div className="mt-2 flex gap-2">
                  {selectedImages.length > 0 && (
                    <button type="button" className="text-xs underline" onClick={() => { setSelectedImages([]); setImagePreviews([]); }}>Clear selection</button>
                  )}
                  {(formData.images || []).length > 0 && selectedImages.length === 0 && (
                    <button type="button" className="text-xs underline" onClick={() => { setFormData({ ...formData, images: [] }); }}>Remove existing images</button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP. Select 3–5 images.</p>
              </div>
            </div>
          </div>

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
              <input type="number" step="0.01" required name="retailPrice" value={formData.retailPrice} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Wholesale Price</label>
              <input type="number" step="0.01" required name="wholesalePrice" value={formData.wholesalePrice} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" required name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#0A1F44] text-white hover:bg-[#0A1F40]" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Save Product'}
            </Button>
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
                  <img src={(p.images && p.images[0]?.imageUrl) || p.imageUrl} alt="" className="w-10 h-10 rounded object-cover bg-gray-200" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-4 text-sm">
                  <p>{p.sku}</p>
                  <p className="text-gray-500">{p.category}</p>
                </td>
                <td className="p-4 text-sm">
                  <p>Retail: ${p.retailPrice}</p>
                  <p className="text-gray-500">Wholesale: ${p.wholesalePrice}</p>
                </td>
                <td className="p-4 text-sm">{p.stockQuantity}</td>
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