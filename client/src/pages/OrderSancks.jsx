import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { snacksData } from "../assets/assets";

const OrderSnacks = () => {
  const location = useLocation();
  const { selectedSeats = [], category, hall, pricePerSeat } = location.state || {};

  const [quantities, setQuantities] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [selectedWaterId, setSelectedWaterId] = useState(null);

  // Convert seat price to number
  const seatPrice = Number(pricePerSeat?.replace(/\D/g, "")) || 0;

  // Handle + / - button clicks
  const updateQuantity = (id, delta) => {
    if (!id) return;
    setQuantities((prev) => {
      const newQty = Math.max((prev[id] || 0) + delta, 0);
      return { ...prev, [id]: newQty };
    });
  };

  // Handle card click → toggle quantity controls
  const handleCardClick = (id) => {
    setActiveCard((prev) => (prev === id ? null : id));
  };

  // Calculate total snacks price
  const totalSnacksPrice = snacksData.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  // Total = seat + snacks
  const totalPrice = seatPrice * selectedSeats.length + totalSnacksPrice;

  // Split snacks and drinks logically
  const snacks = snacksData.filter((item) => item.name !== "Water" && item.name !== "Soft Drink");
  const drinks = snacksData.filter((item) => item.name === "Water" || item.name === "Soft Drink");
  const waterItems = drinks.filter((item) => item.name === "Water");
  const softDrinks = drinks.filter((item) => item.name === "Soft Drink");

  return (
    <div className="p-6 mt-20 text-center text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2 text-primary">
        🎟️ {hall || "Hall"} — {category?.toUpperCase() || ""}
      </h2>
      <p className="text-lg mb-6 text-gray-300">
        {selectedSeats.length} seat(s) selected — Br {(seatPrice * selectedSeats.length).toLocaleString()}
      </p>

      {/* 🍿 Snacks */}
      <h2 className="text-2xl font-bold mb-4 text-primary">🍿 Snacks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-8">
        {snacks.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className={`rounded-2xl p-3 cursor-pointer transition duration-200 border ${
              activeCard === item.id ? "border-primary scale-105" : "border-gray-700 hover:border-primary/50"
            }`}
          >
            <img src={item.image} alt={item.name} className="w-full h-32 object-contain mb-2" />
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
            <p className="mt-2 font-bold text-primary">{item.price} ETB</p>

            {/* Quantity controls */}
            {activeCard === item.id && (
              <div className="flex items-center justify-center mt-2 gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={!quantities[item.id]}
                  className={`px-3 py-1 rounded-full font-bold ${
                    quantities[item.id] ? "bg-primary text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  -
                </button>
                <span className="min-w-[24px]">{quantities[item.id] || 0}</span>
                <button
                  onClick={() => updateQuantity(item.id, +1)}
                  className="px-3 py-1 bg-primary text-white rounded-full font-bold"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🥤 Drinks */}
      <h2 className="text-2xl font-bold mb-4 text-primary">🥤 Drinks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-8">
        {/* Water card */}
        {waterItems.length > 0 && (
          <div
            onClick={() => handleCardClick("water")}
            className={`rounded-2xl p-3 cursor-pointer transition duration-200 border ${
              activeCard === "water" ? "border-primary scale-105" : "border-gray-700 hover:border-primary/50"
            }`}
          >
            <img src={waterItems[0].image} alt="Water" className="w-full h-32 object-contain mb-2" />
            <h3 className="font-semibold text-lg">Water</h3>
            <p className="text-sm text-gray-400">Choose size and quantity</p>

            {activeCard === "water" && (
              <div className="flex flex-col items-center gap-2 mt-2">
                {/* Variant buttons */}
                <div className="flex gap-3">
                  {waterItems.map((w) => (
                    <button
                      key={w.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWaterId(w.id);
                      }}
                      className={`px-3 py-1 rounded-xl border font-medium ${
                        selectedWaterId === w.id ? "bg-primary text-white border-primary" : "border-gray-600 text-gray-400"
                      }`}
                    >
                      {w.desc.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => updateQuantity(selectedWaterId, -1)}
                    disabled={!quantities[selectedWaterId]}
                    className={`px-3 py-1 rounded-full font-bold ${
                      quantities[selectedWaterId] ? "bg-primary text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    -
                  </button>
                  <span className="min-w-[24px]">{quantities[selectedWaterId] || 0}</span>
                  <button
                    onClick={() => updateQuantity(selectedWaterId, +1)}
                    className="px-3 py-1 bg-primary text-white rounded-full font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Soft Drinks */}
        {softDrinks.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className={`rounded-2xl p-3 cursor-pointer transition duration-200 border ${
              activeCard === item.id ? "border-primary scale-105" : "border-gray-700 hover:border-primary/50"
            }`}
          >
            <img src={item.image} alt={item.name} className="w-full h-32 object-contain mb-2" />
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
            <p className="mt-2 font-bold text-primary">{item.price} ETB</p>

            {activeCard === item.id && (
              <div className="flex items-center justify-center mt-2 gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={!quantities[item.id]}
                  className={`px-3 py-1 rounded-full font-bold ${
                    quantities[item.id] ? "bg-primary text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  -
                </button>
                <span className="min-w-[24px]">{quantities[item.id] || 0}</span>
                <button
                  onClick={() => updateQuantity(item.id, +1)}
                  className="px-3 py-1 bg-primary text-white rounded-full font-bold"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Confirm Button */}
      <div className="mt-8">
        <button className="bg-primary text-white px-6 py-3 rounded-2xl text-lg font-semibold">
          Confirm Order — Br {totalPrice.toLocaleString()}
        </button>
      </div>
    </div>
  );
};

export default OrderSnacks;
