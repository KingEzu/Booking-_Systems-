import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";

// Helper to convert row index to letter
const rowLetter = (index) => String.fromCharCode(65 + index); // 0 => A

// Generate seats with custom rows
const generateSeats = (rows, cols, startCol = 1, customRows = {}, reverse = false, disabledSeats = []) => {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const row = rowLetter(r);
    for (let c = 0; c < cols; c++) {
      const col = reverse ? startCol + (cols - 1 - c) : startCol + c;
      const seatId = `${row}${col}`;

      // Only include seat if it’s in customRows (if defined) or default
      if (customRows[row]) {
        if (!customRows[row].includes(col)) continue;
      }

      // Include seat but mark disabled later
      seats.push(seatId);
    }
  }
  return seats;
};


// ---------------- Seat Layout Configurations ----------------
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
      right: {
        rows: 4,
        cols: 9,
        startCol: 16,
          disabledSeats: ["B24"],
      },
    },
  },
 hall2: {
  regular: {
    left: { rows: 12, cols: 6, startCol: 1, customRows: { L: [1, 2, 3] } },
    right: { rows: 12, cols: 6, startCol: 7 },
  },
  vip: {
    left: { rows: 5, cols: 4, startCol: 1, customRows: { E: [1, 2, 3] } },
    right: {
      rows: 5,
      cols: 8,
      startCol: 5,
       disabledSeats: ["E5"], // Hall2 VIP right
    },
  },
},

  hall3: {
  regular: {
  
    left: { rows: 12, cols: 6, startCol: 7, reverse: true, }, // left section normal
    right: { rows: 12, cols: 6, startCol: 1, reverse: true 
        ,     disabledSeats: ["L4", "L5", "L6"], customRows: { L: [1, 2, 3, 4, 5, 6] } },
  },
  vip: {
    left: { rows: 5, cols: 4, startCol: 9, customRows: { E: [10, 11, 12] }, reverse: true }, // left VIP reversed
    right: {
      rows: 5,
      cols: 8,
      startCol: 1,
      customRows: { E: [1, 2, 3, 4, 5, 6, 7, 8] },
       disabledSeats: ["E8"],
      reverse: true, // right VIP reversed
    },
  },}

};

// Map hall codes to layout
const hallMap = {
  C1: "hall1",
  C2: "hall2",
  C3: "hall3",
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
    if (showData) {
      setShow({ movie: showData, dateTime: dummyDateTimeData });
    }
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

  const hallKey = hallMap[selectedTime?.Hall] || "hall1";
  const hallLayout =
    selectedCategory && layouts[hallKey]?.[selectedCategory.toLowerCase()];

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 md:pt-32 text-white">
      <BlurCircle bottom="-20px" right="-20px" />

      {/* Left Sidebar */}
      <div className="w-72 mt-20 bg-primary/10 border border-primary/20 rounded-lg py-8 h-max md:sticky md:top-30">
        <BlurCircle top="-20px" left="-190px" />
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
                      toast.success("Regular selected");
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
                      toast.success("VIP selected");
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

      {/* Seat Layout */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <h1 className="text-2xl font-semibold mb-4 text-amber-400">Select Your Seats</h1>
        {selectedTime && (
          <h2 className="text-sm text-gray-400 mb-6">
            Hall: <span className="text-amber-300">{selectedTime.Hall}</span> • {selectedTime.type} •{" "}
            <span>{selectedCategory ? selectedCategory.toUpperCase() : "No category chosen"}</span>
          </h2>
        )}
        <img src={assets.screenImage} alt="screen" className="mb-3 w-80" />
        <p className="text-gray-400 text-sm mb-6">Screen side</p>

        {hallLayout ? (
          <div className="bg-transparent rounded-xl p-6 shadow-lg w-full max-w-5xl">
            <div className="flex flex-col md:flex-row justify-center items-start gap-8">
        {Object.entries(hallLayout).map(([section, { rows, cols, startCol, customRows, disabledSeats, reverse }]) => (
  <div key={section} className="flex flex-col items-center">
    <h3 className="text-lg font-medium text-amber-400 mb-3 capitalize">{section} Side</h3>
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(20px, 1fr))` }}>
      {generateSeats(rows, cols, startCol, customRows, reverse).map((seat) => {
        const isSelected = selectedSeats.includes(seat);
        const isDisabled = disabledSeats?.includes(seat);
        return (
          <button
            key={seat}
            onClick={() => !isDisabled && toggleSeat(seat)}
            disabled={isDisabled}
            className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md border transition-all duration-200 ${
              isSelected
                ? "bg-primary text-black border-primary scale-105"
                : isDisabled
                ? "bg-transparent cursor-not-allowed"
                : "bg-gray-700 border-gray-600 hover:bg-amber-500/80 hover:scale-105"
            }`}
          ></button>
        );
      })}
    </div>
  </div>
))}


            </div>

            {selectedSeats.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-gray-300 text-sm">Selected Seats:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {selectedSeats.map((seat) => (
                    <span key={seat} className="px-3 py-1 text-sm bg-amber-500/30 border border-amber-400 rounded">
                      {seat}
                    </span>
                  ))}
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
