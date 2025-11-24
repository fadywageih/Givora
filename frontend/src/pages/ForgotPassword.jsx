import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { requestPasswordReset, resetPassword } = useAuth();
  const { toast } = useToast();
  const [resetToken, setResetToken] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      requestPasswordReset(email);
      setSubmitted(true);
      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    try {
      if (newpassword !== confirmNewPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        return;
      }

      resetPassword(resetToken, newpassword);
      setSubmitted(true);
      toast({
        title: "Password Reset",
        description: "Your password has been reset.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    finally {
      navigate('/login');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A1F44] mb-2">Check your email</h2>
          <p className="text-gray-600 mb-6">We have sent a password reset link to <strong>{email}</strong></p>
          <div className="space-y-4 mb-6">
            <input type="text" placeholder="Enter Reset Token" value={resetToken} onChange={(e) => setResetToken(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C9A227] outline-none" />
            <input type="password" placeholder="Enter New Password" value={newpassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C9A227] outline-none" />
            <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C9A227] outline-none" />
          </div>
          <div className="flex flex-col space-y-4" >
            <Button type="button" onClick={handleReset} className="w-full  bg-[#0A1F44] hover:bg-[#0a1f22] text-white">Reset Password</Button>
            <Link to="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Forgot Password - GIVORA</title></Helmet>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <h1 className="text-2xl font-bold text-[#0A1F44] mb-2">Forgot Password?</h1>
          <p className="text-gray-600 text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#C9A227] outline-none"
              />
            </div>
            <Button type="submit" className="w-full  bg-[#0A1F44] hover:bg-[#0a1f22] text-white">Send Reset Link</Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-[#0A1F44] hover:underline">Back to Login</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;