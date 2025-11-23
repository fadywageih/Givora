import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { dbOrders } from '@/lib/db';
import { User, Package, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile, wholesaleDetails } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setOrders(dbOrders.getByUserId(user.id));
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your information has been saved." });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
                  <input className="w-full p-2 border rounded" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" />
                  <input className="w-full p-2 border rounded" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" />
                  <input className="w-full p-2 border rounded" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                  <textarea className="w-full p-2 border rounded" name="address" value={formData.address} onChange={handleChange} placeholder="Address" rows={3} />
                  
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" size="sm" className="bg-[#0A1F44] text-white flex-1"><Save className="w-4 h-4 mr-2"/> Save</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}><X className="w-4 h-4"/></Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 text-sm text-[#0A1F44]">
                  <p><span className="font-semibold">Name:</span> {user.first_name} {user.last_name}</p>
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
                <p className="font-medium text-[#0A1F44]">Type: <span className="capitalize">{user.account_type}</span></p>
                {user.account_type === 'wholesale' && (
                  <>
                     <p className="text-sm mt-1">Status: {user.approved ? <span className="text-green-600 font-bold">Active</span> : <span className="text-yellow-600">Pending Approval</span>}</p>
                     {wholesaleDetails && (
                       <p className="text-sm mt-1">Lifetime Units: {wholesaleDetails.total_units_ordered}</p>
                     )}
                  </>
                )}
              </div>
              
              {user.account_type === 'retail' && (
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
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-[#0A1F44]">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium capitalize">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {order.items.length} items • Method: {order.payment_method}
                      </div>
                      <div className="flex justify-between items-center border-t pt-3 mt-2">
                        <span className="font-bold text-[#0A1F44]">${order.total_amount.toFixed(2)}</span>
                        {order.shipping_method === 'express' && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Express Shipping</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;