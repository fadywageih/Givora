import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { User, Package, Edit2, Save, X, Eye, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ordersAPI } from '../lib/api';
const Profile = () => {
  const { user, updateUserProfile, wholesaleDetails, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      // console.log(user);
      ordersAPI.getAll().then((res) => {
        console.log(res.data.orders);
        setOrders(res.data.orders);
      });
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address
      });
    } else {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your information has been saved." });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-900 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-900 border-red-200';
      default:
        return 'bg-gray-50 text-gray-900 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user) return null;

  return (
    <>
      <Helmet><title>My Profile - GIVORA</title></Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-[#D9DFE7] opacity-80">Manage your account and view orders</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#0A1F44] flex items-center gap-2">
                  <User className="w-5 h-5" /> Personal Info
                </h2>
                {!isEditing && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input className="w-full p-2 border rounded" name="first_name" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                  <input className="w-full p-2 border rounded" name="last_name" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                  <input className="w-full p-2 border rounded" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                  <textarea className="w-full p-2 border rounded" name="address" value={formData.address} onChange={handleChange} placeholder="Address" rows={3} />

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" size="sm" className="bg-[#0A1F44] text-white flex-1"><Save className="w-4 h-4 mr-2" /> Save</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}><X className="w-4 h-4" /></Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 text-sm text-[#0A1F44]">
                  <p><span className="font-semibold">Name:</span> {user.firstName} {user.lastName}</p>
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                  <p><span className="font-semibold">Phone:</span> {user.phone || 'Not set'}</p>
                  <p><span className="font-semibold">Address:</span> {user.address || 'Not set'}</p>
                </div>
              )}
            </div>

            {/* Wholesale Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#0A1F44] mb-4">Account Status</h2>
              <div className="p-3 bg-gray-50 rounded border border-gray-200 mb-4">
                <p className="font-medium text-[#0A1F44]">Type: <span className="capitalize">{user.accountType}</span></p>
                {user.accountType === 'wholesale' && (
                  <>
                    <p className="text-sm mt-1">Status: {user.approved ? <span className="text-green-600 font-bold">Active</span> : <span className="text-yellow-600">Pending Approval</span>}</p>
                    {wholesaleDetails && (
                      <p className="text-sm mt-1">Lifetime Units: {wholesaleDetails.totalUnitsOrdered}</p>
                    )}
                  </>
                )}
              </div>

              {user.accountType === 'retail' && (
                <Button onClick={() => navigate('/wholesale-registration')} variant="outline" className="w-full">
                  Apply for Wholesale Account
                </Button>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#0A1F44] mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" /> Order History
              </h2>

              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-bold text-[#0A1F44]">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Items</p>
                          <p className="font-medium text-[#0A1F44]">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="font-medium text-[#0A1F44] capitalize">{order.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-t pt-3">
                        <span className="font-bold text-lg text-[#0A1F44]">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-[#0A1F44] hover:bg-[#0A1F44]/10"
                        >
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-[#0A1F44]">Order #{selectedOrder.id.slice(0, 8)}</h2>
                <p className="text-sm text-gray-600 mt-1">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Overview */}
              <div className={`p-4 rounded-lg border ${getStatusColor(selectedOrder.status)}`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedOrder.status)}
                  <div>
                    <p className="text-sm font-medium">Order Status</p>
                    <p className="text-lg font-bold capitalize">{selectedOrder.status}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Items</p>
                  <p className="text-2xl font-bold text-[#0A1F44]">{selectedOrder.items?.length || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Payment Method</p>
                  <p className="text-lg font-bold text-[#0A1F44] capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Shipping</p>
                  <p className="text-lg font-bold text-[#0A1F44] capitalize">{selectedOrder.shippingMethod || 'Standard'}</p>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold text-[#0A1F44] mb-3">Shipping Address</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-[#0A1F44] mb-3">Order Items</h3>
                <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => {
                      const price = item.price || item.product?.retailPrice || 0;
                      const quantity = item.quantity || 1;
                      const total = (price * quantity).toFixed(2);
                      return (
                        <div 
                        key={idx} 
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="flex justify-between items-start pb-3 hover:opacity-80 transition-opacity border-b last:border-b-0">
                          <div  className="flex cursor-pointer   items-center gap-3">
                            <div>
                              <img src={(item.product.images && item.product.images[0]?.imageUrl) || item.product.imageUrl}
                                alt={item.product?.name} className="w-16 h-16 object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-[#0A1F44]">{item.product?.name || 'Unknown Product'}</p>
                              <p className="text-xs text-gray-600">SKU: {item.product?.sku || 'N/A'}</p>
                              <p className="text-sm text-gray-600 mt-1">Qty: {quantity}</p>

                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#0A1F44]">
                              ${total}
                            </p>
                            <p className="text-xs text-gray-600">${price.toFixed(2)} each</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-600 text-sm">No items in this order</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${((selectedOrder.totalAmount || 0) - (selectedOrder.shippingCost || 0)).toFixed(2)}
                    </span>
                  </div>
                  {(selectedOrder.shippingCost || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${(selectedOrder.shippingCost || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t font-semibold text-[#0A1F44] text-base">
                    <span>Total</span>
                    <span>${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowOrderDetails(false)}
                className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;