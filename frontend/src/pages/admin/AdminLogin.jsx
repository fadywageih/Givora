import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(email, password);
      toast({ title: "Welcome Back", description: "Logged in as administrator." });
      navigate('/admin/wholesale');
    } catch (error) {
      toast({ title: "Access Denied", description: error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet><title>Admin Login - GIVORA</title></Helmet>
      <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-[#0A1F44]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0A1F44]">Admin Portal</h1>
            <p className="text-gray-500 text-sm">Authorized personnel only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A1F44] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0A1F44] outline-none"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white">
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;