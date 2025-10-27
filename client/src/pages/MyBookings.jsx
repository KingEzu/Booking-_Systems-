import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import TimeForamt from "../lib/TimeForamt";
import { dateFormat } from "../lib/dateFormat";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return !isLoading ? (
    <div className="relative px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 pt-28 md:pt-36 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className="text-xl md:text-2xl font-semibold mb-6">My Bookings</h1>

      {bookings.map((item, index) => (
        <div key={index} className="mb-6">
          {/* 📱 Mobile & Tablet Layout */}
          <div className="block lg:hidden bg-primary/10 border border-primary/20 rounded-2xl shadow-sm p-4">
            {/* 1️⃣ Movie Title | Runtime */}
            <div className="flex justify-between py-1 border-b border-gray-700/30">
              <span>🎬 {item.show.movie.title}</span>
              <span>⏱ {TimeForamt(item.show.movie.runtime)}</span>
            </div>

            {/* 2️⃣ Show Date */}
            <div className="flex justify-between py-1 border-b border-gray-700/30">
              <span>📅 Show Date</span>
              <span>{dateFormat(item.show.showDateTime)}</span>
            </div>

            {/* 3️⃣ Total Seats | Seat Numbers */}
            <div className="flex justify-between py-1 border-b border-gray-700/30">
              <span>💺 Seats: {item.bookedSeats.length}</span>
              <span>🎟️ {item.bookedSeats.join(", ")}</span>
            </div>

            {/* 4️⃣ Snacks | Amount */}
            <div className="flex justify-between py-1 border-b border-gray-700/30">
              <span>
                🍿{" "}
                {item.Snacks && item.Snacks.length > 0
                  ? item.Snacks.map((snack, i) => (
                      <span key={i}>
                        {snack.quantity}× {snack.name}
                        {i < item.Snacks.length - 1 && ", "}
                      </span>
                    ))
                  : "No snacks"}
              </span>
              <span>💰 {currency}{item.amount}</span>
            </div>

            {/* 5️⃣ Optional Pay Button */}
            {!item.isPaid && (
              <div className="flex justify-end pt-2">
                <button className="bg-primary px-4 py-1.5 rounded-full text-sm text-white font-medium">
                  💳 Pay Now
                </button>
              </div>
            )}
          </div>

          {/* 💻 Desktop Layout */}
          <div className="hidden lg:flex justify-between bg-primary/10 border border-primary/20 rounded-2xl shadow-sm p-6 max-w-4xl">
            <div className="flex gap-6">
              <img
                src={item.show.movie.poster_path}
                alt={item.show.movie.title}
                className="w-40 h-auto object-cover rounded-lg border border-gray-700"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xl font-semibold">{item.show.movie.title}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    ⏱ {TimeForamt(item.show.movie.runtime)}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    📅 {dateFormat(item.show.showDateTime)}
                  </p>
                </div>
                <div className="mt-4 text-gray-300 text-sm">
                  <p>💺 Total Seats: {item.bookedSeats.length}</p>
                  <p>🎟️ Seat Numbers: {item.bookedSeats.join(", ")}</p>
                  <p>
                    🍿 Snacks:{" "}
                    {item.Snacks && item.Snacks.length > 0
                      ? item.Snacks.map((snack, i) => (
                          <span key={i}>
                            {snack.quantity}× {snack.name}
                            {i < item.Snacks.length - 1 && ", "}
                          </span>
                        ))
                      : "No snacks"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end text-right">
              <p className="text-2xl font-semibold mb-3">
                💰 {currency}{item.amount}
              </p>
              {!item.isPaid && (
                <button className="bg-primary px-5 py-2 rounded-full text-white font-medium hover:bg-primary/80 transition">
                  💳 Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
