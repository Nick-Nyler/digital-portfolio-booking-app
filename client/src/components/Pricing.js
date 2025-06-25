import React from 'react';
import { motion } from 'framer-motion';

function Pricing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 text-center"
    >
      <h2 className="text-3xl font-bold mb-6">Pricing Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/20 backdrop-blur-md p-6 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-2">Basic</h3>
          <p className="text-2xl mb-4">$5/month</p>
          <ul className="text-left text-gray-300">
            <li>5 Portfolio Items</li>
            <li>Basic Booking</li>
          </ul>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/20 backdrop-blur-md p-6 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-2">Pro</h3>
          <p className="text-2xl mb-4">$15/month</p>
          <ul className="text-left text-gray-300">
            <li>Unlimited Items</li>
            <li>Analytics</li>
            <li>Priority Support</li>
          </ul>
        </motion.div>
      </div>
      <motion.a
        href="mailto:info@artify.com?subject=Subscription Inquiry"
        className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
        whileHover={{ scale: 1.05 }}
      >
        Contact for Subscription
      </motion.a>
    </motion.div>
  );
}

export default Pricing;
