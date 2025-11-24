import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getDiscountRate, user } = useAuth();
  const navigate = useNavigate();

  const isWholesale = user?.account_type === 'wholesale' && user?.approved;
  const volumeDiscount = getDiscountRate();

  const calculateItemPrice = (item) => {
    const product = item.product;
    let price = isWholesale ? product.wholesalePrice : product.retailPrice;
    if (isWholesale && volumeDiscount > 0) {
      price = price * (1 - volumeDiscount);
    }
    return price;
  };

  const subtotal = cart.reduce((sum, item) => {
    return sum + (calculateItemPrice(item) * item.quantity);
  }, 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0A1F44]/10 p-8 rounded-full">
            <ShoppingBag className="w-12 h-12 text-[#0A1F44]" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#0A1F44] mb-4">Your Cart is Empty</h2>
        <p className="text-[#0A1F44]/70 mb-8">Looks like you haven't added any items yet.</p>
        <Link to="/shop">
          <Button size="lg" className="bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - GIVORA</title>
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-24 h-24 bg-white border border-gray-200 rounded flex items-center justify-center flex-shrink-0 p-2">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-[#0A1F44] text-lg">{item.product.name}</h3>
                  <p className="text-sm text-[#0A1F44]/60 mb-2">SKU: {item.product.sku}</p>
                  <p className="font-medium text-[#C9A227]">
                    ${calculateItemPrice(item)?.toFixed(2)} <span className="text-xs text-gray-400">/ unit</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#D9DFE7] rounded">
                    <button
                      className="p-2 hover:bg-gray-100"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      className="p-2 hover:bg-gray-100"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-[#0A1F44] mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#0A1F44]/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#0A1F44]/80">
                  <span>Shipping</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-[#0A1F44]/80">
                  <span>Tax</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-xl text-[#0A1F44]">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white h-12 text-lg"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm text-[#0A1F44]/70 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;