import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Truck, DollarSign, Users, Building2, Hotel, Utensils, Hotel as Hospital, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const categories = [
    { name: 'Tissue', icon: '🧻' },
    { name: 'Paper Towels', icon: '🧻' },
    { name: 'Gloves', icon: '🧤' },
    { name: 'Garbage Bags', icon: '🗑️' },
    { name: 'Underpads', icon: '🛏️' },
    { name: 'Cups', icon: '🥤' },
    { name: 'Paper Bags', icon: '🛍️' }
  ];

  const features = [
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Premium products meeting institutional standards with rigorous quality control.'
    },
    {
      icon: Truck,
      title: 'Fast Fulfillment',
      description: 'Efficient logistics and reliable delivery to keep your operations running smoothly.'
    },
    {
      icon: DollarSign,
      title: 'Bulk Pricing',
      description: 'Competitive wholesale pricing for approved B2B customers with volume discounts.'
    },
    {
      icon: Users,
      title: 'B2B Support',
      description: 'Dedicated account management and professional customer service for businesses.'
    }
  ];

  const industries = [
    { icon: Hotel, name: 'Hotels' },
    { icon: Utensils, name: 'Restaurants' },
    { icon: Hospital, name: 'Healthcare' },
    { icon: Store, name: 'Markets' }
  ];

  return (
    <>
      <Helmet>
        <title>GIVORA - Premium Institutional Supply for Hotels, Restaurants & Healthcare</title>
        <meta name="description" content="Delivering excellence to hotels, restaurants and healthcare facilities. Quality institutional supplies with wholesale pricing for approved B2B customers." />
      </Helmet>

      <section className="bg-gradient-to-br from-[#0A1F44] to-[#0A1F44]/90 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Institutional Supply
            </h1>
            <p className="text-xl md:text-2xl text-[#D9DFE7] mb-8">
              Delivering excellence to hotels, restaurants and healthcare facilities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="bg-[#C9A227] hover:bg-[#C9A227]/90 text-white px-8">
                  Shop Supplies
                </Button>
              </Link>
              <Link to="/wholesale-registration">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0A1F44] px-8">
                  Request a Wholesale Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#D9DFE7]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#0A1F44]">
            Product Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <span className="text-sm font-medium text-[#0A1F44]">{category.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0A1F44]">
            Why Givora?
          </h2>
          <p className="text-center text-[#0A1F44]/70 mb-12 max-w-2xl mx-auto">
            We provide comprehensive solutions for institutional supply needs with professional service and competitive pricing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-[#C9A227] mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-[#0A1F44]">{feature.title}</h3>
                <p className="text-[#0A1F44]/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#D9DFE7]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#0A1F44]">
            Trusted By
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md"
              >
                <industry.icon className="w-16 h-16 text-[#0A1F44] mb-3" />
                <span className="text-lg font-medium text-[#0A1F44]">{industry.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;