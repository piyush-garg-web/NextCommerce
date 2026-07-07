'use client';

import React from 'react';

export default function Testimonial() {
  return (
    <section className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-4">"Great products and excellent service!"</p>
            <p className="font-semibold">- Customer {item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
