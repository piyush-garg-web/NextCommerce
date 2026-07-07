'use client';

import React from 'react';

export default function FeaturedProduct() {
  return (
    <section className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="border rounded-lg p-4 bg-white">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <h3 className="font-semibold mb-2">Product {item}</h3>
            <p className="text-gray-600">$99.99</p>
          </div>
        ))}
      </div>
    </section>
  );
}
