import React from 'react';
import { Helmet } from 'react-helmet';

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy - GIVORA</title>
        <meta name="description" content="Review GIVORA's refund and return policy for institutional supply orders." />
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            Refund Policy
          </h1>
          <p className="text-xl text-[#D9DFE7]">
            Last Updated: November 21, 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">1. Return Window</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Products may be returned within 30 days of delivery for a full refund, provided they are in original, unopened condition with all packaging intact. Due to the nature of institutional supplies, opened or used products cannot be returned for hygiene and safety reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">2. Damaged or Defective Products</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed mb-4">
              If you receive damaged or defective products, please contact us within 48 hours of delivery. We will arrange for replacement or full refund at no additional cost to you. To expedite the process, please provide:
            </p>
            <ul className="list-disc pl-6 text-[#0A1F44]/80 space-y-2">
              <li>Order number and product details</li>
              <li>Clear photographs of the damage or defect</li>
              <li>Description of the issue</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">3. Return Process</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed mb-4">
              To initiate a return:
            </p>
            <ol className="list-decimal pl-6 text-[#0A1F44]/80 space-y-2">
              <li>Contact our customer service team at info@givora.com or 1-800-GIVORA-1</li>
              <li>Provide your order number and reason for return</li>
              <li>Receive return authorization and shipping instructions</li>
              <li>Ship the product back using the provided prepaid shipping label (for defective items) or at your expense (for other returns)</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">4. Refund Processing</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Once we receive and inspect your returned product, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method. Please allow additional time for your financial institution to process the refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">5. Non-Returnable Items</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 text-[#0A1F44]/80 space-y-2">
              <li>Opened or used hygiene products (gloves, masks, underpads)</li>
              <li>Custom or special order items</li>
              <li>Clearance or final sale items</li>
              <li>Products damaged due to misuse or improper storage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">6. Shipping Costs</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              For defective or damaged products, GIVORA will cover all return shipping costs. For other returns, the customer is responsible for return shipping expenses unless the return is due to our error.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">7. Wholesale Orders</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Wholesale orders are subject to the same return policy. Due to the larger quantities typically involved in wholesale orders, we encourage customers to inspect shipments promptly upon delivery and report any issues immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">8. Order Cancellations</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              Orders can be cancelled without penalty if the cancellation request is received before the order has been shipped. Once an order has shipped, standard return procedures apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">9. Contact for Returns</h2>
            <p className="text-[#0A1F44]/80 leading-relaxed">
              For all return inquiries, please contact our customer service team at info@givora.com or call 1-800-GIVORA-1 during business hours (Monday-Friday, 9AM-6PM EST).
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;