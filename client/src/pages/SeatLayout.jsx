import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";

// Helper to convert row index to letter
const rowLetter = (index) => String.fromCharCode(65 + index);

// Generate seats
const generateSeats = (rows, cols, startCol = 1, customRows = {}, reverse = false) => {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const row = rowLetter(r);
    for (let c = 0; c < cols; c++) {
      const col = reverse ? startCol + (cols - 1 - c) : startCol + c;
      const seatId = `${row}${col}`;
      if (customRows[row] && !customRows[row].includes(col)) continue;
      seats.push(seatId);
    }
  }
  return seats;
};

// Seat Layout Configurations
const layouts = {
  hall1: {
    regular: {
      left: { rows: 9, cols: 6, startCol: 1 },
      middle: { rows: 9, cols: 11, startCol: 7 },
      right: { rows: 9, cols: 6, startCol: 18 },
    },
    vip: {
      left: { rows: 4, cols: 7, startCol: 1 },
      middle: { rows: 5, cols: 8, startCol: 8 },
      right: { rows: 4, cols: 9, startCol: 16, disabledSeats: ["B24"] },
    },
  },
  hall2: {
    regular: {
      left: { rows: 12, cols: 6, startCol: 1, customRows: { L: [1, 2, 3] } },
      right: { rows: 12, cols: 6, startCol: 7 },
    },
    vip: {
      left: { rows: 5, cols: 4, startCol: 1, customRows: { E: [1, 2, 3] } },
      right: { rows: 5, cols: 8, startCol: 5, disabledSeats: ["E5"] },
    },
  },
  hall3: {
    regular: {
      left: { rows: 12, cols: 6, startCol: 7, reverse: true },
      right: {
        rows: 12,
        cols: 6,
        startCol: 1,
        reverse: true,
        disabledSeats: ["L4", "L5", "L6"],
        customRows: { L: [1, 2, 3, 4, 5, 6] },
      },
    },
    vip: {
      left: {
        rows: 5,
        cols: 4,
        startCol: 9,
        customRows: { E: [10, 11, 12] },
        reverse: true,
      },
      right: {
        rows: 5,
        cols: 8,
        startCol: 1,
        customRows: { E: [1, 2, 3, 4, 5, 6, 7, 8] },
        disabledSeats: ["E8"],
        reverse: true,
      },
    },
  },
};

const hallMap = { C1: "hall1", C2: "hall2", C3: "hall3" };
const screenWidths = {
  hall1: "w-[400px] sm:w-[450px] md:w-[500px]",
  hall2: "w-[480px] sm:w-[520px] md:w-[580px]",
  hall3: "w-[380px] sm:w-[430px] md:w-[470px]",
};

const SeatLayout = () => {
  const { id, date } = useParams();
  const [show, setShow] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  const getShow = async () => {
    const showData = dummyShowsData.find((s) => s._id === id);
    if (showData) setShow({ movie: showData, dateTime: dummyDateTimeData });
  };

  useEffect(() => {
    getShow();
  }, []);

  const toggleSeat = (seatId) => {
    if (!selectedTime) return toast.error("Please select a time first");
    if (!selectedCategory) return toast.error("Please choose Regular or VIP first");
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : prev.length < 8
        ? [...prev, seatId]
        : (toast.error("Maximum 8 seats allowed"), prev)
    );
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) return toast.error("Please select at least one seat");
    navigate(`/Movies/${id}/${date}/Snacks`, {
      state: {
        selectedSeats,
        category: selectedCategory,
        hall: selectedTime.Hall,
        pricePerSeat: selectedCategory === "vip" ? selectedTime.Vip : selectedTime.regular,
      },
    });
  };

  const hallKey = hallMap[selectedTime?.Hall] || "hall1";
  const hallLayout = selectedCategory && layouts[hallKey]?.[selectedCategory.toLowerCase()];
  const screenWidthClass = screenWidths[hallKey];

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 md:pt-32 text-white">
      <BlurCircle bottom="-20px" right="-20px" />

      {/* Left Sidebar */}
      <div className="w-72 mt-20 bg-primary/10 border border-primary/20 rounded-lg py-8 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6 text-amber-400">Available Timings</p>
        <div className="mt-5 space-y-3">
          {show?.dateTime?.[date]?.map((item) => (
            <div
              key={item.time}
              onClick={() => {
                setSelectedTime(item);
                setSelectedCategory(null);
                setSelectedSeats([]);
              }}
              className={`border rounded-lg mx-3 px-4 py-3 cursor-pointer transition-all duration-200 ${
                selectedTime?.time === item.time
                  ? "bg-primary text-amber-300 border-amber-400"
                  : "hover:bg-primary/20 border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <p className="text-sm font-medium">{isoTimeFormat(item.time)}</p>
                </div>
                <p className="text-sm text-gray-300">{item.type}</p>
                <p className="text-sm font-semibold text-amber-400">{item.Hall}</p>
              </div>

              {selectedTime?.time === item.time && (
                <div className="flex justify-around mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory("regular");
                      setSelectedSeats([]);
                    }}
                    className={`px-3 py-1 text-sm rounded-md border transition ${
                      selectedCategory === "regular"
                        ? "bg-amber-400/20 border-amber-400 text-amber-300"
                        : "border-amber-400 hover:bg-amber-400/10"
                    }`}
                  >
                    Regular – {item.regular}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory("vip");
                      setSelectedSeats([]);
                    }}
                    className={`px-3 py-1 text-sm rounded-md border transition ${
                      selectedCategory === "vip"
                        ? "bg-amber-400/20 border-amber-400 text-amber-300"
                        : "border-amber-400 hover:bg-amber-400/10"
                    }`}
                  >
                    VIP – {item.Vip}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Seat Layout Section */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <h1 className="text-2xl font-semibold mb-4 text-amber-400">Select Your Seats</h1>
        {selectedTime && (
          <h2 className="text-sm text-gray-400 mb-6">
            Hall: <span className="text-amber-300">{selectedTime.Hall}</span> • {selectedTime.type} •{" "}
            <span>{selectedCategory ? selectedCategory.toUpperCase() : "No category chosen"}</span>
          </h2>
        )}

        <img src={assets.screenImage} alt="screen" className={`${screenWidthClass} mb-1`} />
        <p className="text-gray-400 text-sm mb-6">Screen side</p>

        {selectedCategory && hallLayout ? (
          <div className="bg-transparent rounded-xl p-6 shadow-lg w-full max-w-5xl flex flex-col items-center gap-8">
            
            {/* Scrollable Seat Buttons Only */}
            <div className="w-full overflow-x-auto lg:overflow-x-hidden">
              <div className="flex gap-8 min-w-max justify-start lg:justify-center">
                {Object.entries(hallLayout).map(
                  ([section, { rows, cols, startCol, customRows, disabledSeats, reverse }]) => {
                    const seats = generateSeats(rows, cols, startCol, customRows, reverse);
                    return (
                      <div key={section} className="flex flex-col items-center gap-3 flex-shrink-0">
                        <h3 className="text-lg font-medium text-amber-400 capitalize">{section} Side</h3>
                        <div
                          className="grid gap-2"
                          style={{ gridTemplateColumns: `repeat(${cols}, minmax(30px, 1fr))` }}
                        >
                          {seats.map((seat) => {
                            const isSelected = selectedSeats.includes(seat);
                            const isDisabled = disabledSeats?.includes(seat) ?? false;
                            return (
                              <button
                                key={seat}
                                onClick={() => !isDisabled && toggleSeat(seat)}
                                disabled={isDisabled}
                                className={`w-7 h-7 sm:w-8 md:w-9 rounded-md border text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 ${
                                  isSelected
                                    ? "bg-primary text-black border-primary scale-105"
                                    : isDisabled
                                    ? "bg-transparent cursor-not-allowed text-gray-500"
                                    : "bg-gray-700 border-gray-600 hover:bg-amber-500/80 hover:scale-105 text-white"
                                }`}
                              >
                                {!isDisabled && seat}
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

            {/* Selected Seats & Proceed */}
            {selectedSeats.length > 0 && (
              <div className="mt-6 flex flex-col md:flex-row justify-between items-center w-full gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-gray-300 text-sm">Selected:</p>
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 text-sm bg-amber-500/30 border border-amber-400 rounded"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-semibold text-amber-400">
                    Total:{" "}
                    <span className="text-white">
                      {(() => {
                        const price = Number(
                          (selectedCategory === "vip" ? selectedTime.Vip : selectedTime.regular).replace(
                            /\D/g,
                            ""
                          )
                        );
                        return `Br ${(price * selectedSeats.length).toLocaleString()}`;
                      })()}
                    </span>
                  </p>
                  <button
                    onClick={handleProceed}
                    className="bg-primary hover:bg-primary-dull text-black font-semibold px-6 py-3 rounded-full transition-all active:scale-95"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 italic mt-6">Please select a category to view seats.</p>
        )}
      </div>
    </div>
  );
};

export default SeatLayout;
