import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Hotel, Utensils, Hotel as Hospital, Store, CheckCircle } from 'lucide-react';

const Industries = () => {
  const industries = [
    {
      icon: Hotel,
      name: 'Hotels & Hospitality',
      description: 'Premium supplies for guest rooms, housekeeping, and front-of-house operations. From luxury linens to essential amenities, we provide comprehensive solutions for hospitality excellence.',
      features: [
        'Guest room amenities and toiletries',
        'Housekeeping supplies and equipment',
        'Laundry and cleaning products',
        'Front desk and concierge materials'
      ]
    },
    {
      icon: Utensils,
      name: 'Restaurants & Food Service',
      description: 'Food-safe products and disposables for commercial kitchens, dining areas, and takeout services. Maintain hygiene standards while delivering exceptional service to your customers.',
      features: [
        'Food preparation and storage supplies',
        'Disposable tableware and containers',
        'Kitchen cleaning and sanitation',
        'Takeout packaging solutions'
      ]
    },
    {
      icon: Hospital,
      name: 'Healthcare & Clinics',
      description: 'Medical-grade supplies meeting strict healthcare standards. Support patient care and facility operations with reliable, quality products designed for medical environments.',
      features: [
        'Patient care supplies and underpads',
        'Medical-grade gloves and PPE',
        'Infection control products',
        'Facility maintenance supplies'
      ]
    },
    {
      icon: Store,
      name: 'Retail & Markets',
      description: 'Essential supplies for retail operations, from checkout to stockroom. Enhance customer experience and streamline operations with our comprehensive product range.',
      features: [
        'Shopping bags and packaging',
        'Cleaning and maintenance supplies',
        'Break room and restroom products',
        'Point-of-sale materials'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Industries We Serve - GIVORA</title>
        <meta name="description" content="GIVORA serves hotels, restaurants, healthcare facilities, and retail markets with premium institutional supplies and dedicated B2B support." />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Industries We Serve
          </h1>
          <p className="text-xl text-[#D9DFE7] max-w-3xl">
            Comprehensive supply solutions tailored to the unique needs of your industry
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#D9DFE7]/20 flex items-center justify-center p-12">
                  <industry.icon className="w-32 h-32 text-[#0A1F44]" />
                </div>
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-[#0A1F44] mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                    {industry.name}
                  </h2>
                  <p className="text-[#0A1F44]/80 mb-6 leading-relaxed">
                    {industry.description}
                  </p>
                  <div className="space-y-3">
                    {industry.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                        <span className="text-[#0A1F44]/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Industries;