// src/components/Pricing.js
import React from 'react';
import { motion } from 'framer-motion';

const feeTiers = [
  {
    id: 'creators',
    title: 'Creators (Sellers)',
    details: [
      '20% flat fee on every booking',
      'Tiered discount: 15% on first $500 earned, 10% thereafter',
    ],
  },
  {
    id: 'clients',
    title: 'Clients (Buyers)',
    details: [
      '5% service fee on every booking total',
      'Flat $3 fee on bookings under $100',
    ],
  },
];

function Pricing() {
  return (
    <div className="min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 bg-gradient-to-b from-purple-800 to-blue-700"
      >
        <h1 className="text-4xl font-bold text-white mb-8">Fee Structure</h1>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {feeTiers.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white/20 backdrop-blur-md rounded-lg p-8 flex flex-col"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">{tier.title}</h2>
              <ul className="text-white text-left list-disc pl-5 mb-6">
                {tier.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <p className="mt-12 text-white">
          Transparent, competitive fees so you know exactly what you pay.
        </p>
      </motion.section>
    </div>
  );
}

export default Pricing;
 