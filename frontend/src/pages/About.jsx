import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building2, Award, Users, TrendingUp } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'We never compromise on product quality, ensuring every item meets institutional standards.'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Dedicated support and personalized service for every B2B customer relationship.'
    },
    {
      icon: TrendingUp,
      title: 'Reliability',
      description: 'Consistent supply chain and on-time delivery you can depend on.'
    },
    {
      icon: Building2,
      title: 'Industry Expertise',
      description: 'Deep understanding of institutional supply needs across multiple sectors.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About GIVORA - Premium Institutional Supply</title>
        <meta name="description" content="Learn about GIVORA, powered by GIGI Import. We deliver premium institutional supplies to hotels, restaurants, healthcare facilities, and retail markets." />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            About GIVORA
          </h1>
          <p className="text-xl text-[#D9DFE7]">
            Excellence in institutional supply since our founding
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-[#0A1F44] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
              Our Story
            </h2>
            <p className="text-[#0A1F44]/80 mb-6 leading-relaxed">
              GIVORA is a premier institutional supply company dedicated to serving the unique needs of hotels, restaurants, healthcare facilities, and retail markets. Powered by GIGI Import, we leverage extensive industry experience and robust supply chain capabilities to deliver exceptional products and service to our B2B customers.
            </p>
            <p className="text-[#0A1F44]/80 mb-8 leading-relaxed">
              Our commitment goes beyond simply providing products. We understand the critical role that reliable, high-quality supplies play in your daily operations. That is why we have built our business on the foundation of quality assurance, competitive pricing, and responsive customer support.
            </p>

            <h2 className="text-3xl font-bold text-[#0A1F44] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <value.icon className="w-12 h-12 text-[#C9A227] mb-4" />
                <h3 className="text-xl font-semibold text-[#0A1F44] mb-3">{value.title}</h3>
                <p className="text-[#0A1F44]/70">{value.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#D9DFE7]/20 rounded-lg p-8 mt-12">
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              Powered by GIGI Import
            </h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              As part of the GIGI Import family, GIVORA benefits from established supplier relationships, efficient logistics networks, and proven business practices. This partnership enables us to offer competitive wholesale pricing, maintain consistent product availability, and provide the level of service that institutional customers require and deserve.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default About;