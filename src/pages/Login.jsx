import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin, register, verifyEmail } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'retail',
    first_name: '',
    last_name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast({
        title: "Google Login Successful",
        description: "Welcome to GIVORA!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleVerify = async () => {
    const success = await verifyEmail(verificationEmail);
    if (success) {
      toast({
        title: "Email Verified",
        description: "You can now log in.",
      });
      setShowVerification(false);
      setIsLogin(true);
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid email or already verified.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Login Successful",
          description: "Welcome back to GIVORA.",
        });
        navigate('/');
      } else {
        // Registration
        await register(formData);
        setVerificationEmail(formData.email);
        setShowVerification(true);
        toast({
          title: "Registration Successful",
          description: "Please verify your email address to continue.",
        });
      }
    } catch (error) {
      toast({
        title: isLogin ? "Login Failed" : "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center"
        >
          <div className="mx-auto bg-[#C9A227]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[#C9A227]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">Verify Your Email</h2>
          <p className="text-[#0A1F44]/70 mb-6">
            We've sent a verification link to <strong>{verificationEmail}</strong>.
            (For this demo, click the button below to simulate clicking the email link).
          </p>
          <Button onClick={handleVerify} className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            Verify & Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Register'} - GIVORA</title>
        <meta name="description" content="Secure login for GIVORA institutional accounts." />
      </Helmet>

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-[#0A1F44] mb-6 text-center">
            {isLogin ? 'Login' : 'Create Account'}
          </h1>

          <div className="mb-6">
            <Button 
              type="button"
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border-[#D9DFE7] hover:bg-gray-50"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#D9DFE7]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#0A1F44]/50">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">First Name</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">Last Name</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg" />
                 </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                    Account Type
                  </label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  >
                    <option value="retail">Retail B2B</option>
                    <option value="wholesale">Wholesale B2B (Requires Approval)</option>
                  </select>
                </div>
              </>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#C9A227] hover:underline text-sm block w-full"
            >
              {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
            </button>
            {isLogin && (
               <Link to="/forgot-password">
                 <button className="text-[#0A1F44]/60 hover:text-[#0A1F44] text-xs underline">
                   Forgot Password?
                 </button>
               </Link>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;