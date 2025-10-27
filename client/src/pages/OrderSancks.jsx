import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { snacksData } from "../assets/assets";
import { ArrowLeftIcon } from "lucide-react";

// Reusable card component for snacks and drinks
const ItemCard = ({ item, activeCard, handleCardClick, quantities, updateQuantity }) => {
  const qty = quantities[item.id] || 0;
  const showControls = activeCard === item.id || qty > 0; // show if active or quantity > 0

  return (
    <div
      onClick={() => handleCardClick(item.id)}
      className={`rounded-2xl p-3 cursor-pointer transition duration-200 border ${
        activeCard === item.id ? "border-primary scale-105" : "border-gray-700 hover:border-primary/50"
      }`}
    >
      <img src={item.image} alt={item.name} className="w-full h-32 object-contain mb-2" />
      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p className="text-sm text-gray-400">{item.desc}</p>
      <p className="mt-2 font-bold text-primary">{item.price} ETB</p>

      {showControls && (
        <div className="flex items-center justify-center mt-2 gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => updateQuantity(item.id, -1)}
            disabled={!qty}
            className={`px-3 py-1 rounded-full font-bold ${
              qty ? "bg-primary text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            -
          </button>
          <span className="min-w-[24px]">{qty}</span>
          <button
            onClick={() => updateQuantity(item.id, +1)}
            className="px-3 py-1 bg-primary text-white rounded-full font-bold"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

const OrderSnacks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, date } = useParams();
  const { selectedSeats = [], category, hall, pricePerSeat, prevTime } = location.state || {};

  const [quantities, setQuantities] = useState({});
  const [activeCard, setActiveCard] = useState(null);

  const seatPrice = Number(pricePerSeat?.replace(/\D/g, "")) || 0;

  const updateQuantity = (id, delta) => {
    if (!id) return;
    setQuantities((prev) => {
      const newQty = Math.max((prev[id] || 0) + delta, 0);
      return { ...prev, [id]: newQty };
    });
  };

  const handleCardClick = (id) => {
    setActiveCard((prev) => (prev === id ? null : id));
  };

  const totalSnacksPrice = snacksData.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  const totalPrice = seatPrice * selectedSeats.length + totalSnacksPrice;

  // Split items by type
  const snacks = snacksData.filter((item) => item.type === "Snack");
  const drinks = snacksData.filter((item) => item.type === "Drink");
  const waterItems = drinks.filter((item) => item.name.includes("Water"));
  const softDrinks = drinks.filter((item) => item.name.includes("Soft Drink"));

  const handleBackToSeats = () => {
    navigate(`/Movies/${id}/${date}`, {
      state: {
        prevSelectedSeats: selectedSeats,
        prevCategory: category,
        prevTime: prevTime,
      },
    });
  };

  return (
    <div className="p-6 pt-50 text-center text-white max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center cursor-pointer" onClick={handleBackToSeats}>
          <ArrowLeftIcon className="w-10 h-10 animate-bounce text-primary mr-2" />
        </div>

        <button className="bg-primary text-white px-6 py-3 rounded-2xl text-lg font-semibold">
          Confirm Order — Br {totalPrice.toLocaleString()}
        </button>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold mb-2 text-primary">
        🎟️ {hall || "Hall"} — {category?.toUpperCase() || ""}
      </h2>

      {/* Selected Seats */}
      {selectedSeats.length > 0 ? (
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <span className="text-lg font-medium text-white">
            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} {selectedSeats.join(", ")}
          </span>
          <span className="text-primary-dull text-5xl">
            Br {(seatPrice * selectedSeats.length).toLocaleString()}
          </span>
        </div>
      ) : (
        <p className="text-gray-400 mb-4 italic">No seats selected yet</p>
      )}

      {/* 🍽️ Snacks Section */}
      {snacks.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-primary-dul">🍽️ Snacks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-8">
            {snacks.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                activeCard={activeCard}
                handleCardClick={handleCardClick}
                quantities={quantities}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>
        </>
      )}

      {/* 💧 Drinks Section */}
      {(waterItems.length > 0 || softDrinks.length > 0) && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-primary">💧 Drinks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-8">
            {waterItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                activeCard={activeCard}
                handleCardClick={handleCardClick}
                quantities={quantities}
                updateQuantity={updateQuantity}
              />
            ))}

            {softDrinks.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                activeCard={activeCard}
                handleCardClick={handleCardClick}
                quantities={quantities}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSnacks;
