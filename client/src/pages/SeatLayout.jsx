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
      left: { rows: 5, cols: 4, startCol: 9, customRows: { E: [10, 11, 12] }, reverse: true },
      right: { rows: 5, cols: 8, startCol: 1, customRows: { E: [1, 2, 3, 4, 5, 6, 7, 8] }, disabledSeats: ["E8"], reverse: true },
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
  

  useEffect(() => {
    const showData = dummyShowsData.find((s) => s._id === id);
    if (showData) setShow({ movie: showData, dateTime: dummyDateTimeData });
  }, [id]);

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
    <div className="min-h-screen w-full overflow-y-hidden overflow-x-hidden">
      <div className="flex flex-col lg:flex-row px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-16 md:py-20 lg:pt-28 text-white relative">
        <BlurCircle bottom="-20px" right="-20px" />

        {/* Timings Panel */}
        <div className="w-full lg:w-80 xl:w-96 mt-15 lg:mt-20 bg-primary/10 border border-primary/20 rounded-lg py-6 lg:py-8 h-max lg:sticky lg:top-28 mb-6 lg:mb-0 lg:mr-8">
          <p className="text-lg font-semibold px-6 text-amber-400">Available Timings</p>
          <div className="mt-4 flex flex-col gap-3">
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <ClockIcon className="w-4 h-4" />
                    <p className="text-sm font-medium">{isoTimeFormat(item.time)}</p>
                  </div>
                  <p className="text-sm text-gray-300 text-center md:text-left">{item.type}</p>
                  <p className="text-sm font-semibold text-amber-400 text-center md:text-right">{item.Hall}</p>
                </div>

                {selectedTime?.time === item.time && (
                  <div className="flex flex-col xs:flex-row justify-around mt-3 gap-2">
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
        <div className="flex-1 flex flex-col mt-15 items-center w-full">
          <h1 className="text-xl xs:text-2xl font-semibold mb-4 text-amber-400 text-center">Select Your Seats</h1>
          {selectedTime && (
            <h2 className="text-sm text-gray-400 mb-6 text-center">
              Hall: <span className="text-amber-300">{selectedTime.Hall}</span> • {selectedTime.type} •{" "}
              <span>{selectedCategory ? selectedCategory.toUpperCase() : "No category chosen"}</span>
            </h2>
          )}

          <img src={assets.screenImage} alt="screen" className={`${screenWidthClass} mb-1 max-w-full`} />
          <p className="text-gray-400 text-sm mb-6">Screen side</p>

          {selectedCategory && hallLayout ? (
            <div className="bg-transparent rounded-xl p-3 xs:p-4 sm:p-6 w-full max-w-6xl flex flex-col items-center gap-4 xs:gap-6">

              {/* Scrollable layout for all widths below 1024px */}
              <div className="flex gap-4 overflow-x-auto w-full pb-4 lg:hidden">
                {Object.entries(hallLayout).map(([section, { rows, cols, startCol, customRows, disabledSeats, reverse }]) => {
                  const seats = generateSeats(rows, cols, startCol, customRows, reverse);
                  return (
                    <div
                      key={section}
                      className="flex flex-col items-center gap-3 flex-shrink-0 bg-gray-800/20 rounded-lg p-3"
                      style={{ minWidth: `${Math.max(cols * 36, 280)}px` }} // smooth scroll
                    >
                      <h3 className="text-lg font-medium text-amber-400 capitalize">{section} Side</h3>
                      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(28px, 1fr))` }}>
                        {seats.map((seat) => {
                          const isSelected = selectedSeats.includes(seat);
                          const isDisabled = disabledSeats?.includes(seat) ?? false;
                          return (
                            <button
                              key={seat}
                              onClick={() => !isDisabled && toggleSeat(seat)}
                              disabled={isDisabled}
                              className={`w-7 h-7 rounded-md border text-[10px] font-medium transition-all duration-200 ${
                                isSelected
                                  ? "bg-amber-400 text-black border-amber-400 scale-105"
                                  : isDisabled
                                  ? "bg-gray-700/50 text-gray-400 border-gray-600 cursor-not-allowed"
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
                })}
              </div>

              {/* Desktop Layout (≥1024px) */}
              <div className="hidden lg:flex gap-4 md:gap-6 xl:gap-8 2xl:gap-12 justify-center w-full mt-4">
                {Object.entries(hallLayout).map(([section, { rows, cols, startCol, customRows, disabledSeats, reverse }]) => {
                  const seats = generateSeats(rows, cols, startCol, customRows, reverse);
                  return (
                    <div key={section} className="flex flex-col items-center gap-3 bg-gray-800/10 p-4 rounded-xl shadow-lg">
                      <h3 className="text-lg font-semibold text-amber-400 capitalize">{section} Side</h3>
                      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(32px, 1fr))` }}>
                        {seats.map((seat) => {
                          const isSelected = selectedSeats.includes(seat);
                          const isDisabled = disabledSeats?.includes(seat) ?? false;
                          return (
                            <button
                              key={seat}
                              onClick={() => !isDisabled && toggleSeat(seat)}
                              disabled={isDisabled}
                              className={`w-8 h-8 md:w-9 md:h-9 rounded-md border text-xs md:text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? "bg-amber-400 text-black border-amber-400 scale-105"
                                  : isDisabled
                                  ? "bg-gray-700/50 text-gray-400 border-gray-600 cursor-not-allowed"
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
                })}
              </div>

              {/* Selected Seats Summary */}
              {selectedSeats.length > 0 && (
                <div className="mt-4 xs:mt-6 flex flex-col sm:flex-row justify-between items-center w-full gap-3 xs:gap-4 bg-gray-800/30 rounded-lg p-4 xs:p-6">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 w-full sm:w-auto">
                    <p className="text-gray-300 text-sm font-medium whitespace-nowrap">Selected Seats:</p>
                    <div className="flex flex-wrap gap-2 justify-center xs:justify-start">
                      {selectedSeats.map((seat) => (
                        <span key={seat} className="px-2 xs:px-3 py-1 text-xs xs:text-sm bg-amber-500/30 border border-amber-400 rounded">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 w-full sm:w-auto mt-3 xs:mt-0">
                    <p className="text-base xs:text-lg font-semibold text-amber-400 whitespace-nowrap">
                      Total:{" "}
                      <span className="text-white">
                        {(() => {
                          const price = Number(
                            (selectedCategory === "vip" ? selectedTime.Vip : selectedTime.regular).replace(/\D/g, "")
                          );
                          return `Br ${(price * selectedSeats.length).toLocaleString()}`;
                        })()}
                      </span>
                    </p>
                    <button
                      onClick={handleProceed}
                      className="bg-primary hover:bg-primary-dull text-black font-semibold px-4 xs:px-6 py-2 xs:py-3 rounded-full transition-all active:scale-95 w-full sm:w-auto text-sm xs:text-base"
                    >
                      Proceed to Snacks
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex justify-center py-8">
              <p className="text-gray-400 italic text-center">
                {selectedTime ? "Please select a category to view seats." : "Please select a time to view available seats."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
