import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Eye, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    try {
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      const res = await adminAPI.getOrders(status);
      console.log(res.data.orders);
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to load orders', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast({
        title: 'Success',
        description: `Order status updated to ${newStatus}`,
        variant: 'success'
      });
      await loadOrders();
      setShowDetails(false);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update order status', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
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

  return (
    <>
      <Helmet><title>Orders - Admin</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0A1F44]">Order Management</h1>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            onClick={() => setSelectedStatus(status)}
            variant={selectedStatus === status ? 'default' : 'outline'}
            className={selectedStatus === status
              ? 'bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90'
              : 'border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white'}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Items</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-[#0A1F44]">#{order.id}</td>
                  <td className="p-4 text-sm">
                    <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                    <p className="text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="p-4 font-semibold text-[#0A1F44]">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#0A1F44]">Order #{selectedOrder.id}</h2>
              <p className="text-sm text-gray-600 mt-1">{formatDate(selectedOrder.createdAt)}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-[#0A1F44] mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{selectedOrder.user?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Account Type</p>
                    <p className="font-medium capitalize">{selectedOrder.user?.accountType}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold text-[#0A1F44] mb-3">Shipping Address</h3>
                  <p className="text-sm text-gray-700">
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
                        <div key={idx} className="flex justify-between items-start pb-3 border-b last:border-b-0">
                          <div className="flex-1">
                            <p className="font-medium text-[#0A1F44]">{item.product?.name || 'Unknown Product'}</p>
                            <p className="text-xs text-gray-600">SKU: {item.product?.sku || 'N/A'}</p>
                            <p className="text-sm text-gray-600 mt-1">Qty: {quantity}</p>
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
                  <div className="flex justify-between pt-2 border-t font-semibold text-[#0A1F44]">
                    <span>Total</span>
                    <span>${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold text-[#0A1F44] mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      disabled={updating || selectedOrder.status === status}
                      variant={selectedOrder.status === status ? 'default' : 'outline'}
                      className={selectedOrder.status === status
                        ? 'bg-[#0A1F44] text-white'
                        : 'border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white'}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
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

export default OrderManagement;
