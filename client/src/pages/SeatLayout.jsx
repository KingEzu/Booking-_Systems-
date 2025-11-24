import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import { ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

 const currency = import.meta.env.VITE_CURENCY;
const rowLetter = (index) => String.fromCharCode(65 + index);

const generateSeats = (rows, cols, startCol = 1, customRows = {}, reverse = false) => {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const row = rowLetter(r);
    for (let c = 0; c < cols; c++) {
      const col = reverse ? startCol + (cols - 1 - c) : startCol + c;
      if (customRows && customRows[row] && !customRows[row].includes(col)) continue;
      seats.push(`${row}${col}`);
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

const MAX_SELECTION = 8;

// ----------------- Normalization helpers -----------------
const getFirst = (obj, keys) => {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    if (typeof obj[k] !== "undefined" && obj[k] !== null) return obj[k];
  }
  return undefined;
};

const normalizeTimeItem = (raw) => {
  if (!raw || typeof raw !== "object") return raw;

  const time = getFirst(raw, ["time", "startTime", "start_time", "datetime", "dateTime", "show_time", "t"]);
  const type = getFirst(raw, ["type", "showType", "format", "kind"]);
  const Hall = getFirst(raw, ["Hall", "hall", "hall_name", "hallName"]);
  const showId = getFirst(raw, ["showId", "show_id", "id", "_id"]);
  const regular = raw.showPrice?.regular ?? getFirst(raw, ["regular", "regular_price", "regularPrice", "price", "seatPrice"]);
  const Vip = raw.showPrice?.vip ?? getFirst(raw, ["Vip", "vip", "vip_price", "vipPrice"]);

  return {
    ...raw,
    time,
    type,
    Hall,
    showId,
    regular,
    Vip,
  };
};

const normalizeShow = (rawShow) => {
  if (!rawShow || typeof rawShow !== "object") return rawShow;
  const show = { ...rawShow };

  // normalize dateTime into a map: { dateString: [items] }
  let dt = show.dateTime ?? show.date_time ?? show.date_times ?? show.showTimes ?? null;

  if (Array.isArray(dt)) {
    const grouped = {};
    dt.forEach((it) => {
      const item = normalizeTimeItem(it);
      const d = getFirst(item, ["date", "showDate", "show_date", "dateOnly"]) ?? "unknown";
      if (!grouped[d]) grouped[d] = [];
      grouped[d].push(item);
    });
    show.dateTime = grouped;
  } else if (dt && typeof dt === "object") {
    const normalizedMap = {};
    Object.entries(dt).forEach(([dateKey, arr]) => {
      if (Array.isArray(arr)) {
        normalizedMap[dateKey] = arr.map((it) => normalizeTimeItem(it));
      } else if (typeof arr === "object") {
        normalizedMap[dateKey] = [normalizeTimeItem(arr)];
      } else {
        normalizedMap[dateKey] = [];
      }
    });
    show.dateTime = normalizedMap;
  } else {
    show.dateTime = show.dateTime ?? {};
  }

  show.Hall = show.Hall ?? show.hall ?? show.hallName;
  show.regular = show.regular ?? show.regular_price ?? show.price ?? show.regularPrice;
  show.Vip = show.Vip ?? show.vip ?? show.vip_price ?? show.vipPrice;

  return show;
};
// ---------------------------------------------------------

const SeatLayout = () => {
  const { id, date } = useParams();
  const [show, setShow] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastApiResponse, setLastApiResponse] = useState(null);

  const navigate = useNavigate();
  const { axios, getToken } = useAppContext();

  // ref to the seats container so we can scroll it into view on small screens when a category is selected
  const seatsContainerRef = useRef(null);

  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedSeats([]);
    // scroll the seat layout into view so mobile users see the seats after choosing a category
    try {
      // small timeout lets the UI update before scrolling
      setTimeout(() => {
        if (seatsContainerRef?.current && typeof seatsContainerRef.current.scrollIntoView === 'function') {
          seatsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // fallback: scroll the window to the seat area top
          const el = document.querySelector('.seat-layout-anchor');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    } catch (e) {
      console.warn('SeatLayout: scroll failed', e);
    }
  }; 

  const parsePrice = useCallback((p) => {
    if (typeof p === "number") return p;
    if (!p && p !== 0) return 0;
    const cleaned = String(p).replace(/[^0-9.]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  }, []);

  const buildConfig = useCallback(
    async (extra = {}) => {
      try {
        if (typeof getToken === "function") {
          const token = await getToken();
          if (token) return { headers: { Authorization: `Bearer ${token}` }, ...extra };
        }
      } catch (err) {
        console.warn("SeatLayout: getToken failed", err);
      }
      return extra;
    },
    [getToken]
  );

  const findShowInObject = (obj, depth = 0) => {
    if (!obj || typeof obj !== "object" || depth > 4) return null;
    if (obj.dateTime || obj.movie || obj.title || obj._id || obj.showId || obj.Hall) return obj;
    for (const k of Object.keys(obj)) {
      try {
        const candidate = obj[k];
        if (candidate && typeof candidate === "object") {
          const found = findShowInObject(candidate, depth + 1);
          if (found) return found;
        }
      } catch (e) {}
    }
    return null;
  };

  const getShow = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLastApiResponse(null);

    if (!axios) {
      console.warn("SeatLayout: axios missing; using dummy fallback");
      const fallback = dummyShowsData.find((s) => String(s._id) === String(id));
      if (fallback) {
        setShow(normalizeShow({ movie: fallback, dateTime: dummyDateTimeData }));
      } else {
        setShow(null);
        setError("No axios and no dummy found");
      }
      setLoading(false);
      return;
    }

    try {
      const config = await buildConfig();
      const res = await axios.get(`/api/show/${id}`, config);
      const raw = res?.data ?? res;
      setLastApiResponse(raw);

      // quick common keys
      const possible = raw?.show || raw?.data || raw?.result || raw?.payload || raw;
      if (possible && (possible.dateTime || possible.movie || possible.title || possible._id)) {
        const normalized = normalizeShow(possible);
        setShow(normalized);
        setLoading(false);
        return;
      }

      const found = findShowInObject(raw);
      if (found) {
        const normalized = normalizeShow(found);
        setShow(normalized);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("SeatLayout: fetch error:", err);
      setLastApiResponse({ error: String(err) });
    }

    // fallback to dummy
    const fallback = dummyShowsData.find((s) => String(s._id) === String(id));
    if (fallback) {
      setShow(normalizeShow({ movie: fallback, dateTime: dummyDateTimeData }));
      setLoading(false);
      return;
    }

    setShow(null);
    setError("Show not found");
    setLoading(false);
  }, [axios, id, buildConfig]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No show id provided");
      return;
    }
    getShow();
  }, [getShow, id]);

  const getOccupiedSeats = useCallback(async () => {
    // derive showId from normalized selectedTime (support multiple possible keys)
    const showId = selectedTime ? getFirst(selectedTime, ["showId", "show_id", "id", "_id"]) : null;
    if (!showId) {
      setOccupiedSeats([]);
      return;
    }

    try {
      const config = await buildConfig();
      const { data } = await axios.get(`/api/booking/seats/${showId}`, config);
      const raw = data ?? {};
      if (raw?.success && Array.isArray(raw.occupiedSeats)) {
        setOccupiedSeats(raw.occupiedSeats.map((s) => String(s).trim().toUpperCase()));
        return;
      }
      if (Array.isArray(raw?.occupiedSeats)) {
        setOccupiedSeats(raw.occupiedSeats.map((s) => String(s).trim().toUpperCase()));
        return;
      }
      setOccupiedSeats([]);
    } catch (err) {
      console.error("SeatLayout: error loading occupied seats:", err);
      toast.error("Error loading occupied seats");
      setOccupiedSeats([]);
    }
  }, [axios, selectedTime, buildConfig]);

  useEffect(() => {
    if (selectedTime) getOccupiedSeats();
    else setOccupiedSeats([]);
  }, [selectedTime, getOccupiedSeats]);

  const hallKey = useMemo(() => hallMap[selectedTime?.Hall] || hallMap[getFirst(selectedTime, ["Hall", "hall"]) ] || "hall1", [selectedTime]);

  const hallLayout = useMemo(() => {
    if (!selectedCategory) return null;
    return layouts[hallKey]?.[selectedCategory.toLowerCase()] ?? null;
  }, [hallKey, selectedCategory]);

  const screenWidthClass = useMemo(() => screenWidths[hallKey] ?? screenWidths.hall1, [hallKey]);

  const seatsBySection = useMemo(() => {
    if (!hallLayout) return {};
    return Object.fromEntries(
      Object.entries(hallLayout).map(([section, opts]) => [
        section,
        generateSeats(opts.rows, opts.cols, opts.startCol, opts.customRows, opts.reverse),
      ])
    );
  }, [hallLayout]);

  const disabledSeatSet = useMemo(() => {
    const set = new Set();
    if (!hallLayout) return set;
    Object.values(hallLayout).forEach((opts) => {
      (opts.disabledSeats || []).forEach((s) => set.add(String(s).trim().toUpperCase()));
    });
    (occupiedSeats || []).forEach((s) => set.add(String(s).trim().toUpperCase()));
    return set;
  }, [hallLayout, occupiedSeats]);

  const toggleSeat = (seatIdRaw) => {
    const seatId = String(seatIdRaw).trim().toUpperCase();
    if (!selectedTime) return toast.error("Please select a time first");
    if (!selectedCategory) return toast.error("Please choose Regular or VIP first");
    if (disabledSeatSet.has(seatId)) return toast.error("Seat is not available");

    setSelectedSeats((prev) => {
      const present = prev.map((s) => s.toUpperCase()).includes(seatId);
      if (present) return prev.filter((s) => s.toUpperCase() !== seatId);
      if (prev.length >= MAX_SELECTION) {
        toast.error(`Maximum ${MAX_SELECTION} seats allowed`);
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const handleProceed = () => {
    if (!selectedTime) return toast.error("Please select a time first");
    if (selectedSeats.length === 0) return toast.error("Please select at least one seat");
    const pricePerSeat = parsePrice(
      getFirst(
        selectedTime,
        selectedCategory === "vip"
          ? ["Vip", "vip", "vip_price", "vipPrice"]
          : ["regular", "price", "regular_price", "regularPrice", "seatPrice"]
      )
    );
    navigate(`/Movies/${id}/${date}/Snacks`, {
      state: {
        selectedSeats,
        category: selectedCategory,
        hall: selectedTime.Hall,
        pricePerSeat,
      },
    });

    if(occupiedSeats.includes(seatId)){
      return toast('this Seats is already booked')

    }
  };

  const bookTickets = async () => {
    try{
      if(!user) return toast.error('Please first login Please')

        if(!selectedTime || !selectedSeats.length) return toast.error('please select a time and seats')
    
            const {data} = await axios.post('/api/booking/create')
        } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedTime) console.log("Normalized selectedTime:", selectedTime);
  }, [selectedTime]);

  if (loading) return <Loading />;

  if (!show) {
    return (
      <div className="min-h-screen flex items-start justify-center p-8">
        <div className="max-w-4xl w-full text-left text-gray-300">
          <h2 className="text-2xl font-semibold text-amber-400 mb-2">Show not available</h2>
          <p className="mb-2">{error ?? "We couldn't find that show."}</p>

          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Last API response (raw):</p>
            <pre className="text-xs bg-gray-900/50 p-3 rounded overflow-auto max-h-56">{JSON.stringify(lastApiResponse, null, 2)}</pre>
          </div>

          <div className="mb-4 text-sm text-gray-400">
            <p>Tips:</p>
            <ul className="list-disc ml-5">
              <li>Check the Network tab for <code>GET /api/show/{id}</code>.</li>
              <li>If the API returns the show under a different key (e.g. <code>data</code>, <code>result</code>), this page attempts to find it automatically.</li>
              <li>If auth is required, ensure <code>getToken()</code> returns a token and your axios instance uses it.</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded bg-primary" onClick={() => getShow()}>
              Retry
            </button>
            <button className="px-4 py-2 rounded border" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mt-15 overflow-y-hidden overflow-x-hidden">
      <div className="flex flex-col lg:flex-row px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-16 md:py-20 lg:pt-28 text-white relative">
        <BlurCircle bottom="-20px" right="-20px" />

        {/* Timings Panel */}
        <div className="w-full lg:w-80 xl:w-96 mt-4 lg:mt-20 bg-primary/10 border border-primary/20 rounded-lg py-6 lg:py-8 h-max lg:sticky lg:top-28 mb-6 lg:mb-0 lg:mr-8">
          <p className="text-lg font-semibold px-6 text-amber-400">Available Timings</p>
          <div className="mt-4 flex flex-col gap-3">
            {show?.dateTime?.[date] ? (
              show.dateTime[date].map((item, idx) => {
                const normalizedItem = normalizeTimeItem(item);
                return (
                  <div
                    key={normalizedItem.showId ?? normalizedItem.time ?? idx}
                    onClick={() => {
                      setSelectedTime(normalizedItem);
                      setSelectedCategory(null);
                      setSelectedSeats([]);
                    }}
                    className={`border rounded-lg mx-3 px-4 py-3 cursor-pointer transition-all duration-200 ${
                      selectedTime?.time === normalizedItem.time ? "bg-primary text-amber-300 border-amber-400" : "hover:bg-primary/20 border-transparent"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <ClockIcon className="w-4 h-4" />
                        <p className="text-sm font-medium">{isoTimeFormat(normalizedItem.time)}</p>
                      </div>
                      <p className="text-sm text-gray-300 text-center md:text-left">{normalizedItem.type}</p>
                      <p className="text-sm font-semibold text-amber-400 text-center md:text-right">{normalizedItem.Hall}</p>
                    </div>

                    {selectedTime?.time === normalizedItem.time && (
                      <div className="flex flex-col xs:flex-row justify-around mt-3 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCategory("regular");
                          }}
                          className={`px-3 py-1 text-sm rounded-md border transition ${
                            selectedCategory === "regular"
                              ? "bg-amber-400/20 border-amber-400 text-amber-300"
                              : "border-amber-400 hover:bg-amber-400/10"
                          }`}
                        >
                          Regular –{" "}
                          <span className="text-amber-300">
                            {currency} {parsePrice(getFirst(normalizedItem, ["regular", "price", "regular_price", "regularPrice", "seatPrice"])).toLocaleString()}
                          </span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCategory("vip");
                          }}
                          className={`px-3 py-1 text-sm rounded-md border transition ${
                            selectedCategory === "vip"
                              ? "bg-amber-400/20 border-amber-400 text-amber-300"
                              : "border-amber-400 hover:bg-amber-400/10"
                          }`}
                        >
                          VIP –{" "}
                          <span className="text-amber-300">
                            {currency} {parsePrice(getFirst(normalizedItem, ["Vip", "vip", "vip_price", "vipPrice"])).toLocaleString()}
                          </span>
                        </button>
                    </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center italic">No timings available for this date.</p>
            )}
          </div>
        </div>

        {/* Seat Layout Section */}
        <div className="flex-1 flex flex-col mt-4 items-center w-full">
          <h1 className="text-xl xs:text-2xl font-semibold mb-4 text-amber-400 text-center">Select Your Seats</h1>
          {selectedTime && (
            <h2 className="text-sm text-gray-400 mb-6 text-center">
              Hall: <span className="text-amber-300">{selectedTime.Hall}</span> • {selectedTime.type} • {" "}
              <span>{selectedCategory ? selectedCategory.toUpperCase() : "No category chosen"}</span>
            </h2>
          )}

          <img src={assets.screenImage} alt="screen" className={`${screenWidthClass} mb-1 max-w-full`} />
          <p className="text-gray-400 text-sm mb-6">Screen side</p>

          {selectedCategory && hallLayout ? (
            <div ref={seatsContainerRef} className="bg-transparent rounded-xl p-3 xs:p-4 sm:p-6 w-full max-w-6xl flex flex-col items-center gap-4 xs:gap-6 seat-layout-anchor">
              <div className="flex gap-4 overflow-x-auto w-full pb-4 lg:hidden">
                {Object.entries(hallLayout).map(([section, opts]) => {
                  const seats = seatsBySection[section] || [];
                  return (
                    <div
                      key={section}
                      className="flex flex-col items-center gap-3 flex-shrink-0 bg-gray-800/20 rounded-lg p-3"
                      style={{ minWidth: `${Math.max((opts.cols || 6) * 36, 280)}px` }}
                    >
                      <h3 className="text-lg font-medium text-amber-400 capitalize">{section} Side</h3>
                      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${opts.cols}, minmax(28px, 1fr))` }}>
                        {seats.map((seat) => {
                          const seatNorm = String(seat).toUpperCase();
                          const isSelected = selectedSeats.map((s) => s.toUpperCase()).includes(seatNorm);
                          const disabled = disabledSeatSet.has(seatNorm);
                          return (
                            <button
                              key={seat}
                              onClick={() => !disabled && toggleSeat(seat)}
                              disabled={disabled}
                              aria-label={`Seat ${seat}`}
                              className={`w-7 h-7 rounded-md border text-[10px] font-medium transition-all duration-200 ${
                                isSelected ? "bg-amber-400 text-black border-amber-400 scale-105" : disabled ? "bg-gray-700/50 text-gray-400 border-gray-600 cursor-not-allowed" : "bg-gray-700 border-gray-600 hover:bg-amber-500/80 hover:scale-105 text-white"
                              }`}
                            >
                              {!disabled ? seat : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden lg:flex gap-4 md:gap-6 xl:gap-8 2xl:gap-12 justify-center w-full mt-4">
                {Object.entries(hallLayout).map(([section, opts]) => {
                  const seats = seatsBySection[section] || [];
                  return (
                    <div key={section} className="flex flex-col items-center gap-3 bg-gray-800/10 p-4 rounded-xl shadow-lg">
                      <h3 className="text-lg font-semibold text-amber-400 capitalize">{section} Side</h3>
                      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${opts.cols}, minmax(32px, 1fr))` }}>
                        {seats.map((seat) => {
                          const seatNorm = String(seat).toUpperCase();
                          const isSelected = selectedSeats.map((s) => s.toUpperCase()).includes(seatNorm);
                          const disabled = disabledSeatSet.has(seatNorm);
                          return (
                            <button
                              key={seat}
                              onClick={() => !disabled && toggleSeat(seat)}
                              disabled={disabled}
                              aria-label={`Seat ${seat}`}
                              className={`w-8 h-8 md:w-9 md:h-9 rounded-md border text-xs md:text-sm font-medium transition-all duration-200 ${
                                isSelected ? "bg-amber-400 text-black border-amber-400 scale-105" : disabled ? "bg-gray-700/50 text-gray-400 border-gray-600 cursor-not-allowed" : "bg-gray-700 border-gray-600 hover:bg-amber-500/80 hover:scale-105 text-white"
                              }`}
                            >
                              {!disabled ? seat : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

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
                      Total: {" "}
                      <span className="text-white">
                        {(() => {
                          const price = parsePrice(
                            getFirst(
                              selectedTime,
                              selectedCategory === "vip"
                                ? ["Vip", "vip", "vip_price", "vipPrice"]
                                : ["regular", "price", "regular_price", "regularPrice", "seatPrice"]
                            )
                          );
                          return `${currency} ${(price * selectedSeats.length).toLocaleString()}`;
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
