import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { dbContactMessages } from '@/lib/db';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store in DB
    dbContactMessages.create(formData);

    // Simulated Email
    console.log(`[Email Service] Message forwarded to fadywageih14@gmail.com:`, formData);

    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We will respond within 24 business hours.",
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'info@givora.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '1-800-GIVORA-1',
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'United States',
      description: 'Nationwide shipping available'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon-Fri: 9AM-6PM EST',
      description: 'Weekend: Closed'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact & Support - GIVORA</title>
        <meta name="description" content="Get in touch with GIVORA for product inquiries, wholesale account questions, or customer support. We are here to help." />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Contact & Support
          </h1>
          <p className="text-xl text-[#D9DFE7]">
            We are here to assist with your institutional supply needs
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
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Get In Touch
            </h2>
            <div className="space-y-6">
              <a 
                href="https://wa.me/01225087241" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-green-50 border border-green-200 rounded-lg shadow-md p-6 hover:bg-green-100 transition-colors cursor-pointer">
                  <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-green-800 mb-1">Chat on WhatsApp</h3>
                  <p className="text-green-700 font-medium mb-1">+01 225 087 241</p>
                  <p className="text-sm text-green-600/80">Direct chat support</p>
                </div>
              </a>

              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <info.icon className="w-8 h-8 text-[#C9A227] mb-3" />
                  <h3 className="font-semibold text-[#0A1F44] mb-1">{info.title}</h3>
                  <p className="text-[#0A1F44] font-medium mb-1">{info.content}</p>
                  <p className="text-sm text-[#0A1F44]/60">{info.description}</p>
                </motion.div>
              ))}
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
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      Email *
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
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                    >
                      <option value="">Select Subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="wholesale">Wholesale Account</option>
                      <option value="product">Product Question</option>
                      <option value="order">Order Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-[#D9DFE7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;