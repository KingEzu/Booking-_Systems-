import React from 'react';
import { snacksData } from '../assets/assets';

const OrderSnacks = () => {
  // Split snacks and drinks logically
  const snacks = snacksData.filter(item => item.name !== 'Water' && item.name !== 'Soft Drink');
  const drinks = snacksData.filter(item => item.name === 'Water' || item.name === 'Soft Drink');

  return (
    <div className="p-6 text-center">
      {/* Snacks Section */}
      <h2 className="text-2xl font-bold mb-4 text-primary">🍿 Snacks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-8">
        {snacks.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-3 hover:scale-105 transition duration-200"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-32 object-contain mb-2"
            />
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
            <p className="mt-2 font-bold text-primary">{item.price} ETB</p>
          </div>
        ))}
      </div>

      {/* Drinks Section */}
      <h2 className="text-2xl font-bold mb-4 text-primary">🥤 Drinks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {drinks.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-3 hover:scale-105 transition duration-200"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-32 object-contain mb-2"
            />
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
            <p className="mt-2 font-bold text-primary">{item.price} ETB</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSnacks;
