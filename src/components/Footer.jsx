import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A1F44] text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-bold">
              GIVORA
            </span>
            <p className="mt-4 text-[#D9DFE7] text-sm">
              Premium institutional supply for hotels, restaurants, and healthcare facilities.
            </p>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Quick Links</span>
            <div className="flex flex-col space-y-2">
              <Link to="/shop" className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Shop Products
              </Link>
              <Link to="/industries" className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Industries We Serve
              </Link>
              <Link to="/about" className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                About Us
              </Link>
              <Link to="/wholesale-registration" className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Wholesale Registration
              </Link>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Legal</span>
            <div className="flex flex-col space-y-2">
              <Link to="/terms" className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/refund-policy" className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Refund Policy
              </Link>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Contact</span>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-[#D9DFE7] text-sm">
                <Mail className="w-4 h-4" />
                <span>info@givora.com</span>
              </div>
              <div className="flex items-center space-x-2 text-[#D9DFE7] text-sm">
                <Phone className="w-4 h-4" />
                <span>1-800-GIVORA-1</span>
              </div>
              <div className="flex items-center space-x-2 text-[#D9DFE7] text-sm">
                <MapPin className="w-4 h-4" />
                <span>United States</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D9DFE7]/20 mt-8 pt-8 text-center">
          <p className="text-[#D9DFE7] text-sm">
            © 2025 GIVORA. Powered by GIGI Import. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;