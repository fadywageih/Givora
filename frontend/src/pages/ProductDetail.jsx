import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { productsAPI } from '@/lib/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getDiscountRate, addToCart } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsAPI.getById(id);
        if (res.success) {
          setProduct(res.data.product);
          // Set quantity to MOQ by default
          setQuantity(res.data.product.moq);
        } else {
          toast({ title: 'Error', description: 'Product not found', variant: 'destructive' });
          navigate('/shop');
        }
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to load product', variant: 'destructive' });
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1F44] mx-auto mb-4"></div>
          <p className="text-[#0A1F44]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [{ imageUrl: product.imageUrl }] : []);
  const currentImage = images[currentImageIndex];
  const isWholesale = user?.account_type === 'wholesale' && user?.approved;
  const volumeDiscount = getDiscountRate();

  const calculatePrice = () => {
    let price = isWholesale ? product.wholesalePrice : product.retailPrice;
    if (isWholesale && volumeDiscount > 0) {
      price = price * (1 - volumeDiscount);
    }
    return price.toFixed(2);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (quantity < product.moq) {
      toast({
        title: 'Minimum Order Quantity',
        description: `Minimum order quantity is ${product.moq} units.`,
        variant: 'destructive'
      });
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - GIVORA</title>
        <meta name="description" content={product.description || `Buy ${product.name} from GIVORA`} />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-6">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-[#C9A227] hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center group">
              <img
                src={currentImage?.imageUrl}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain p-4"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? 'border-[#C9A227]' : 'border-gray-300'
                    }`}
                  >
                    <img src={img.imageUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Category & Title */}
            <div>
              <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-[#0A1F44] mt-2 mb-2">{product.name}</h1>
              <p className="text-sm text-[#0A1F44]/60">SKU: {product.sku}</p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">Description</h3>
                <p className="text-[#0A1F44]/70 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Pricing */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-[#0A1F44]">${calculatePrice()}</span>
                {isWholesale && (
                  <span className="text-lg text-[#0A1F44]/50 line-through">${product.retailPrice.toFixed(2)}</span>
                )}
              </div>

              {isWholesale && volumeDiscount > 0 && (
                <div className="flex items-center gap-2 text-[#C9A227] font-semibold mb-4">
                  <Tag className="w-4 h-4" />
                  High Volume Bonus: Additional {(volumeDiscount * 100).toFixed(0)}% discount applied!
                </div>
              )}

              <div className="space-y-2 text-sm text-[#0A1F44]/70">
                <p>
                  <strong>Retail Price:</strong> ${product.retailPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Wholesale Price:</strong> ${product.wholesalePrice.toFixed(2)}
                </p>
                <p>
                  <strong>Minimum Order Quantity (MOQ):</strong> {product.moq} units
                </p>
                <p>
                  <strong>Stock Available:</strong> {product.stockQuantity.toLocaleString()} units
                </p>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A1F44] mb-2">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(product.moq, quantity - 1))}
                    disabled={quantity <= product.moq}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Minimum quantity: ${product.moq}`}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center"
                    min={product.moq}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-[#0A1F44]/60 mt-2">
                  Minimum: {product.moq} units • Current: {quantity} units
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white py-3 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Stock Status */}
            {product.stockQuantity < 1000 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">⚠️ Low Stock</p>
                <p className="text-red-600 text-sm">Only {product.stockQuantity.toLocaleString()} units available</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
