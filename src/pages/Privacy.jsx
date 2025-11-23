import React from 'react';
import { Helmet } from 'react-helmet';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - GIVORA</title>
        <meta name="description" content="Learn how GIVORA protects and manages your personal information and business data." />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Privacy Policy
          </h1>
          <p className="text-xl text-[#D9DFE7]">
            Last Updated: November 21, 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">1. Information We Collect</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-[#0A1F44]/80 space-y-2">
              <li>Business name and contact information</li>
              <li>EIN number for wholesale accounts</li>
              <li>Email address and phone number</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">2. How We Use Your Information</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-[#0A1F44]/80 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about products and services</li>
              <li>Process wholesale account applications</li>
              <li>Calculate applicable sales tax</li>
              <li>Improve our products and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">3. Information Sharing</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our business, such as payment processors and shipping carriers, but only to the extent necessary to provide these services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">4. Data Security</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Payment information is processed through Stripe and is subject to their security standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">5. Business Information</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              For wholesale accounts, we collect and maintain business information including EIN numbers and business addresses. This information is used solely for account verification and tax compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">6. Cookies and Tracking</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              We may use cookies and similar tracking technologies to enhance your experience on our website, analyze usage patterns, and improve our services. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">7. Your Rights</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-[#0A1F44]/80 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">8. Changes to This Policy</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">9. Contact Us</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us at info@givora.com or call 1-800-GIVORA-1.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Privacy;