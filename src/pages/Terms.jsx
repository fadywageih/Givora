import React from 'react';
import { Helmet } from 'react-helmet';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - GIVORA</title>
        <meta name="description" content="Read GIVORA's terms of service for institutional supply purchases and wholesale accounts." />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Terms of Service
          </h1>
          <p className="text-xl text-[#D9DFE7]">
            Last Updated: November 21, 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              By accessing and using GIVORA's services, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all users of the site, including browsers, vendors, customers, and contributors of content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">2. Account Types and Pricing</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed mb-4">
              GIVORA offers two account types: Retail B2B and Wholesale B2B. Wholesale pricing is available only to approved wholesale customers who have completed the registration process and received approval from GIVORA.
            </p>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Retail pricing applies to all standard B2B customers. Wholesale customers gain access to discounted tier pricing upon approval. All prices are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">3. Minimum Order Quantities</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Products may have minimum order quantity (MOQ) requirements. MOQ information is displayed on individual product pages and must be met for order placement. Orders below the stated MOQ may be subject to additional fees or may not be accepted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">4. Payment Terms</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Payment is processed through Stripe for all U.S. transactions. We accept major credit cards and ACH transfers for approved wholesale accounts. Sales tax will be automatically calculated and applied based on your shipping address in accordance with applicable state and local laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">5. Shipping and Delivery</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Shipping is available to addresses within the United States. Delivery times and shipping costs vary based on location and carrier availability. GIVORA partners with major carriers including UPS, FedEx, and USPS to ensure reliable delivery of your orders.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">6. Product Quality and Returns</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              All products are subject to quality assurance standards. If you receive defective or damaged products, please contact our customer service team within 48 hours of delivery. Return and refund policies are detailed in our separate Refund Policy document.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">7. Wholesale Account Approval</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Wholesale account applications are subject to approval by GIVORA. We reserve the right to approve or deny applications at our discretion. Approved wholesale customers must maintain good standing and adhere to all terms and conditions to retain wholesale pricing privileges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">8. Limitation of Liability</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              GIVORA shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service, unauthorized access to or alteration of your transmissions or data, or other matters relating to the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">9. Contact Information</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Questions about the Terms of Service should be sent to us at info@givora.com or by calling 1-800-GIVORA-1.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Terms;