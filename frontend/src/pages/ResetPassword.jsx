import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token) {
      toast({ title: "Error", description: "Missing reset token.", variant: "destructive" });
      navigate('/login');
    }
  }, [token, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    try {
      await resetPassword(token, password);
      toast({ title: "Success", description: "Password reset successfully. Please login." });
      navigate('/login');
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to reset password", variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet><title>Reset Password - GIVORA</title></Helmet>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <h1 className="text-2xl font-bold text-[#0A1F44] mb-6">Set New Password</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-1">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C9A227] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C9A227] outline-none"
              />
            </div>
            <Button type="submit" className="w-full bg-[#0A1F44] text-white">Reset Password</Button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;