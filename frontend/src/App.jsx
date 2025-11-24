import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Profile from '@/pages/Profile';
import Industries from '@/pages/Industries';
import About from '@/pages/About';
import WholesaleRegistration from '@/pages/WholesaleRegistration';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import RefundPolicy from '@/pages/RefundPolicy';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/pages/admin/AdminLayout';
import WholesaleApprovals from '@/pages/admin/WholesaleApprovals';
import ContactMessages from '@/pages/admin/ContactMessages';
import ProductManagement from '@/pages/admin/ProductManagement';

function App() {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet" />
          </Helmet>
          <div className="min-h-screen flex flex-col bg-white font-body">
            <Routes>
              {/* Admin Routes - No Header/Footer wrapper for full layout control if desired, but keeping it simple */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="wholesale" element={<WholesaleApprovals />} />
                <Route path="messages" element={<ContactMessages />} />
                <Route path="products" element={<ProductManagement />} />
              </Route>

              {/* Public Routes */}
              <Route path="*" element={
                <>
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/industries" element={<Industries />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/wholesale-registration" element={<WholesaleRegistration />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/refund-policy" element={<RefundPolicy />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;