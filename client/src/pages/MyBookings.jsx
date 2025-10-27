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
      {/* Background Blur Decorations */}
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className="text-xl md:text-2xl font-semibold mb-6">My Bookings</h1>

      <div className="flex flex-col gap-6">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between bg-primary/10 border border-primary/20 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 w-full max-w-4xl"
          >
            {/* Left Section */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <img
                src={item.show.movie.poster_path}
                alt={item.show.movie.title}
                className="w-full sm:w-40 h-56 sm:h-auto object-cover rounded-lg border border-gray-700"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-lg md:text-xl font-semibold">
                    {item.show.movie.title}
                  </p>
                  <p className="text-gray-400 text-sm md:text-base mt-1">
                    {TimeForamt(item.show.movie.runtime)}
                  </p>
                  <p className="text-gray-400 text-sm md:text-base mt-2">
                    {dateFormat(item.show.showDateTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col justify-between mt-4 md:mt-0 md:items-end md:text-right">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <p className="text-xl md:text-2xl font-semibold mb-2 sm:mb-0">
                  {currency}
                  {item.amount}
                </p>
                {!item.isPaid && (
                  <button className="bg-primary px-5 py-2 text-sm md:text-base rounded-full font-medium text-white hover:bg-primary/80 transition">
                    Pay Now
                  </button>
                )}
              </div>

              {/* Seat & Snack Details */}
              <div className="text-sm md:text-base text-gray-300 mt-3">
                <p>
                  <span className="text-gray-400">Total Seats: </span>
                  {item.bookedSeats.length}
                </p>

                <p>
                  <span className="text-gray-400">Seat Numbers: </span>
                  {item.bookedSeats.join(", ")}
                </p>

                <p className="mt-2">
                  <span className="text-gray-400">Snacks: </span>
                  {item.Snacks && item.Snacks.length > 0 ? (
                    <ul className="list-none ml-0 mt-1 space-y-1">
                      {item.Snacks.map((snack, i) => (
                        <li key={i}>
                         {snack.quantity} {" "}  {snack.name} 
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No snacks"
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
