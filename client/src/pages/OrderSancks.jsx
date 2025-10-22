import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";

const HallLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // simulate data
  useEffect(() => {
    setTimeout(() => {
      const show = dummyShowsData.find((s) => s.id === id);
      setSelectedShow(show);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading || !selectedShow) return <Loading />;

  const hallKey = selectedShow.hall.toLowerCase();

  const hallLayout = {
    left: { rows: 8, cols: 6, startCol: 1 },
    middle: { rows: 8, cols: 10, startCol: 7 },
    right: { rows: 8, cols: 6, startCol: 17 },
  };

  const generateSeats = (rows, cols, startCol = 1) => {
    const seats = [];
    for (let r = 0; r < rows; r++) {
      const rowLetter = String.fromCharCode(65 + r);
      for (let c = 0; c < cols; c++) {
        seats.push(`${rowLetter}${startCol + c}`);
      }
    }
    return seats;
  };

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat!");
      return;
    }
    toast.success(`Proceeding with ${selectedSeats.length} seat(s)`);
    navigate("/payment");
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-8">
      <BlurCircle />
      <h2 className="text-3xl font-bold text-amber-400 mb-4">
        {selectedShow.title} — {selectedShow.hall}
      </h2>

      {/* Time and ticket info */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 text-amber-400 text-lg">
          <ClockIcon className="w-5 h-5" />
          {isoTimeFormat(selectedShow.time)}
        </div>
        <div className="flex gap-3 mt-2">
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-500 rounded-lg">
            Regular: 240 ETB
          </span>
          <span className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-lg">
            VIP: 260 ETB
          </span>
        </div>
      </div>

      {/* ✅ Responsive Hall Layout */}
      <div
        className={`w-full ${
          hallKey === "hall1"
            ? "overflow-x-auto md:overflow-x-auto lg:overflow-visible pb-6"
            : "overflow-x-visible"
        }`}
      >
        <div
          className={`${
            hallKey === "hall1"
              ? "flex gap-8 min-w-max justify-start px-4 md:px-6"
              : "grid md:grid-cols-2 lg:flex gap-4 justify-center"
          }`}
        >
          {Object.entries(hallLayout).map(
            ([section, { rows, cols, startCol }]) => {
              const seats = generateSeats(rows, cols, startCol);
              return (
                <div
                  key={section}
                  className="flex flex-col items-center gap-3 bg-gray-800/10 p-4 rounded-xl shadow-lg min-w-[320px] md:min-w-[380px]"
                >
                  <h3 className="text-lg font-semibold text-amber-400 capitalize">
                    {section} Side
                  </h3>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, minmax(30px, 1fr))`,
                    }}
                  >
                    {seats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          onClick={() => toggleSeat(seat)}
                          className={`w-8 h-8 rounded-md border text-xs font-medium transition-all duration-200 ${
                            isSelected
                              ? "bg-amber-400 text-black border-amber-400 scale-105"
                              : "bg-gray-700 border-gray-600 hover:bg-amber-500/80 hover:scale-105 text-white"
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Proceed button */}
      <div className="mt-10">
        <button
          onClick={handleProceed}
          className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-semibold transition-all"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default HallLayout;
