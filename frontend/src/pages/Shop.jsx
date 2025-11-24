import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShoppingCart, Filter, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { dbProducts } from '@/lib/db';

const Shop = () => {
  const { user, getDiscountRate, addToCart } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(dbProducts.getAll());
  }, []);

  const categories = ['all', 'Tissue', 'Paper Towels', 'Gloves', 'Garbage Bags', 'Underpads', 'Cups', 'Paper Bags'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const isWholesale = user?.account_type === 'wholesale' && user?.approved;
  const volumeDiscount = getDiscountRate(); // 0.10 if applicable

  const calculatePrice = (product) => {
    let price = isWholesale ? product.wholesale_price : product.retail_price;
    
    // Apply additional volume discount if applicable
    if (isWholesale && volumeDiscount > 0) {
      price = price * (1 - volumeDiscount);
    }
    
    return price.toFixed(2);
  };

  return (
    <>
      <Helmet>
        <title>Shop Institutional Supplies - GIVORA</title>
        <meta name="description" content="Browse our comprehensive catalog of institutional supplies. Wholesale pricing available for approved B2B customers." />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Products
          </h1>
          <p className="text-xl text-[#D9DFE7]">
            Professional-grade supplies for institutional use
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#0A1F44]" />
            <span className="font-semibold text-[#0A1F44]">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={selectedCategory === category 
                  ? 'bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90' 
                  : 'border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white'}
              >
                {category === 'all' ? 'All Products' : category}
              </Button>
            ))}
          </div>
        </div>

        {isWholesale && (
          <div className="bg-[#C9A227]/10 border border-[#C9A227] rounded-lg p-4 mb-8">
            <p className="text-[#0A1F44] font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Wholesale pricing active.
              {volumeDiscount > 0 && <span className="font-bold ml-1">High Volume Bonus: Additional 10% discount applied!</span>}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="bg-white h-48 relative overflow-hidden group">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
                {product.stock_quantity < 1000 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="text-lg font-semibold text-[#0A1F44] mt-2 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-[#0A1F44]/50 mb-3">
                  SKU: {product.sku}
                </p>
                
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-[#0A1F44]">
                      ${calculatePrice(product)}
                    </span>
                    {isWholesale && (
                      <span className="text-sm text-[#0A1F44]/50 line-through">
                        ${product.retail_price}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#0A1F44]/60 mb-4">
                    MOQ: {product.moq} units
                  </p>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Shop;