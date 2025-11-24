import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbUsers, dbWholesale, dbCart, dbPasswordReset } from '@/lib/db';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Updated Admin Credentials
const ADMIN_ACCOUNTS = [
  { email: 'fadyW@geih@gmail.givora.com', password: 'PaSS@@7821' },
  { email: 'FADyAdmin@gmail.givora.eg', password: 'Test@1#5' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [wholesaleDetails, setWholesaleDetails] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // User Session
    const token = localStorage.getItem('givora_session_token');
    if (token) {
      try {
        const { email } = JSON.parse(atob(token));
        const dbUser = dbUsers.findByEmail(email);
        if (dbUser) {
          setUser(dbUser);
          refreshCart(dbUser.id);
          if (dbUser.account_type === 'wholesale') {
            const details = dbWholesale.getByUserId(dbUser.id);
            setWholesaleDetails(details);
          }
        }
      } catch (e) {
        localStorage.removeItem('givora_session_token');
      }
    }

    // Admin Session
    const adminToken = localStorage.getItem('givora_admin_token');
    if (adminToken) {
      try {
        const { email } = JSON.parse(atob(adminToken));
        if (ADMIN_ACCOUNTS.find(a => a.email === email)) {
          setAdminUser({ email });
        }
      } catch (e) {
        localStorage.removeItem('givora_admin_token');
      }
    }

    setLoading(false);
  }, []);

  const refreshCart = (userId) => {
    if (!userId) return;
    const userCart = dbCart.getByUserId(userId);
    setCart(userCart);
  };

  const login = async (email, password) => {
    const dbUser = dbUsers.findByEmail(email);
    if (!dbUser) throw new Error('Invalid credentials');
    if (dbUser.password_hash !== btoa(password)) throw new Error('Invalid credentials'); 
    if (!dbUser.is_verified) throw new Error('Please verify your email address before logging in.');

    const token = btoa(JSON.stringify({ email: dbUser.email, exp: Date.now() + 3600000 }));
    localStorage.setItem('givora_session_token', token);
    
    setUser(dbUser);
    refreshCart(dbUser.id);

    if (dbUser.account_type === 'wholesale') {
      const details = dbWholesale.getByUserId(dbUser.id);
      setWholesaleDetails(details);
    }
    return dbUser;
  };

  const adminLogin = async (email, password) => {
    const admin = ADMIN_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (!admin) throw new Error('Invalid admin credentials');

    const token = btoa(JSON.stringify({ email: admin.email, role: 'admin', exp: Date.now() + 3600000 }));
    localStorage.setItem('givora_admin_token', token);
    setAdminUser({ email: admin.email });
    return admin;
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('givora_admin_token');
  };

  const googleLogin = async () => {
    const mockGoogleUser = {
      email: 'demo@gmail.com',
      first_name: 'Demo',
      last_name: 'User',
      account_type: 'retail',
      is_verified: true,
      password_hash: 'oauth_user'
    };

    let dbUser = dbUsers.findByEmail(mockGoogleUser.email);
    if (!dbUser) {
      dbUser = dbUsers.create(mockGoogleUser);
    }

    const token = btoa(JSON.stringify({ email: dbUser.email, exp: Date.now() + 3600000 }));
    localStorage.setItem('givora_session_token', token);
    setUser(dbUser);
    refreshCart(dbUser.id);
    return dbUser;
  };

  const register = async (userData) => {
    const hashedPassword = btoa(userData.password);
    const newUser = dbUsers.create({
      email: userData.email,
      password_hash: hashedPassword,
      account_type: userData.accountType,
      first_name: userData.first_name || '', 
      last_name: userData.last_name || '',
      phone: userData.phone || '',
      address: userData.address || ''
    });
    return newUser;
  };

  const verifyEmail = async (email) => {
    return dbUsers.verifyEmail(email);
  };

  const logout = () => {
    setUser(null);
    setWholesaleDetails(null);
    setCart([]);
    localStorage.removeItem('givora_session_token');
  };

  const updateUserProfile = (updates) => {
    if (!user) return;
    const updatedUser = dbUsers.update(user.id, updates);
    setUser(updatedUser);
    return updatedUser;
  };

  const requestPasswordReset = (email) => {
    const dbUser = dbUsers.findByEmail(email);
    if (!dbUser) {
      throw new Error("Email not found.");
    }
    const token = dbPasswordReset.createToken(dbUser.id);
    console.log(`Reset Token for ${email}: ${token}`); 
    return token;
  };

  const resetPassword = (token, newPassword) => {
    const tokenRecord = dbPasswordReset.verifyToken(token);
    if (!tokenRecord) throw new Error("Invalid or expired token.");
    
    dbUsers.update(tokenRecord.user_id, { password_hash: btoa(newPassword) });
    dbPasswordReset.consumeToken(token);
  };

  // Cart & Discount Logic
  const getDiscountRate = () => {
    if (!user || user.account_type !== 'wholesale' || !user.approved) return 0;
    if (wholesaleDetails && wholesaleDetails.total_units_ordered > 10000) {
      return 0.10;
    }
    return 0;
  };

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please register or login to add items to your cart.",
        variant: "destructive"
      });
      return;
    }
    dbCart.addItem(user.id, product, quantity);
    refreshCart(user.id);
    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart.`
    });
  };

  const removeFromCart = (itemId) => {
    dbCart.removeItem(itemId);
    refreshCart(user.id);
  };

  const updateCartQuantity = (itemId, quantity) => {
    dbCart.updateQuantity(itemId, quantity);
    refreshCart(user.id);
  };

  const clearCart = () => {
    if (!user) return;
    dbCart.clear(user.id);
    setCart([]);
  };

  const value = {
    user,
    adminUser,
    wholesaleDetails,
    loading,
    cart,
    login,
    adminLogin,
    adminLogout,
    googleLogin,
    register,
    verifyEmail,
    logout,
    updateUserProfile,
    requestPasswordReset,
    resetPassword,
    getDiscountRate,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    refreshCart
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};