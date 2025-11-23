import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { dbWholesale } from '@/lib/db';

const WholesaleRegistration = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    business_name: '',
    ein_number: '',
    business_type: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    description: '' // extra field for context, not in main table schema but useful
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to your account before applying.",
        variant: "destructive"
      });
      return;
    }

    try {
      dbWholesale.create({
        user_id: user.id,
        ...formData
      });

      toast({
        title: "Application Submitted",
        description: "Thank you for your interest. Our team will review your application and contact you within 2-3 business days.",
      });

      setFormData({
        business_name: '',
        ein_number: '',
        business_type: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        description: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application.",
        variant: "destructive"
      });
    }
  };

  const benefits = [
    'Access to wholesale pricing tiers',
    'Dedicated account manager',
    'Volume discount opportunities',
    'Priority order processing',
    'Flexible payment terms',
    'Customized product solutions'
  ];

  return (
    <>
      <Helmet>
        <title>Wholesale Registration - GIVORA</title>
        <meta name="description" content="Apply for a GIVORA wholesale account to access special B2B pricing and benefits." />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Wholesale Registration
          </h1>
          <p className="text-xl text-[#D9DFE7]">
            Apply for wholesale pricing and exclusive B2B benefits
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-24">
              <Building2 className="w-12 h-12 text-[#C9A227] mb-4" />
              <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">
                Wholesale Benefits
              </h2>
              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                    <span className="text-[#0A1F44]/80">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#0A1F44] mb-6">
                Application Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      EIN Number *
                    </label>
                    <input
                      type="text"
                      name="ein_number"
                      value={formData.ein_number}
                      onChange={handleChange}
                      required
                      placeholder="XX-XXXXXXX"
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      Business Type *
                    </label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    >
                      <option value="">Select Type</option>
                      <option value="hotel">Hotel</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="retail">Retail</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your business and supply needs"
                    className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white"
                >
                  Submit Application
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default WholesaleRegistration;