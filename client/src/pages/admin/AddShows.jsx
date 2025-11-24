import React, { useEffect, useState } from "react";
import Title from "./Title";
import { CheckIcon, StarIcon, TrashIcon } from "@heroicons/react/16/solid";
import Loading from "../../components/Loading";
import { kConverter } from "../../lib/kConverter";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // store {id, title}
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [vipPrice, setVipPrice] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [movieType, setMovieType] = useState("2D");
  const [addingShow, setAddingShow] = useState(false);

  const hallOptions = ["C1", "C2", "C3"];
  const typeOptions = ["2D", "3D"];

  // Fetch now playing movies
  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/now-playing", {
           headers: { Authorization: `Bearer ${await getToken()}` }
,
      });
      if (data.success) setNowPlayingMovies(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    if (user) fetchNowPlayingMovies();
  }, [user]);

  // Handle date-time input
  const handleDateTimeChange = (e) => {
    const value = e.target.value;
    const now = new Date();
    const selected = new Date(value);
    if (selected < now) {
      toast.error("You cannot select a past time!");
      return;
    }
    setDateTimeInput(value);
  };

  // Add date-time to selected hall
  const handleDateTimeAdd = () => {
    if (!selectedHall) return toast.error("Please select a hall!");
    if (!dateTimeInput) return toast.error("Please select a date and time!");

    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const hallData = prev[selectedHall] || {};
      const times = hallData[date] || [];
      if (times.includes(time)) {
        toast.error("This time already exists for the selected hall!");
        return prev;
      }
      return {
        ...prev,
        [selectedHall]: {
          ...hallData,
          [date]: [...times, time],
        },
      };
    });

    setDateTimeInput("");
  };

  // Remove specific time
  const handleRemoveTime = (hall, date, time) => {
    setDateTimeSelection((prev) => {
      const hallData = { ...prev[hall] };
      const filteredTimes = hallData[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) delete hallData[date];
      else hallData[date] = filteredTimes;
      const updated = { ...prev, [hall]: hallData };
      if (Object.keys(hallData).length === 0) delete updated[hall];
      return updated;
    });
  };

  // Submit show
  const handleSubmit = async () => {
    try {
      setAddingShow(true);

      if (!selectedMovie) return toast.error("Please select a movie!");
      if (!regularPrice || !vipPrice)
        return toast.error("Enter both regular and VIP prices");
      if (Object.keys(dateTimeSelection).length === 0)
        return toast.error("Add at least one showtime");

      // Build showsInput
      const showsInput = Object.entries(dateTimeSelection).flatMap(
        ([hall, hallDates]) =>
          Object.entries(hallDates).map(([date, times]) => ({
            hall,
            date,
            times,
          }))
      );

      const payload = {
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        type: movieType,
        price: {
          regular: Number(regularPrice),
          vip: Number(vipPrice),
        },
      
        showsInput,
      };

      const { data } = await axios.post("/api/show/add", payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setDateTimeInput("");
        setRegularPrice("");
        setVipPrice("");
        setMovieType("2D");
        setSelectedHall("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setAddingShow(false);
    }
  };

  if (nowPlayingMovies.length === 0) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Shows" />

      {/* Movie Selection */}
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative max-w-40 cursor-pointer hover:-translate-y-1 transition duration-300 ${
                selectedMovie?.id === movie.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedMovie({ id: movie.id, title: movie.title })}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={image_base_url + movie.poster_path}
                  alt={movie.title}
                  className="w-full object-cover brightness-90"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary-dull" />
                    {movie.vote_average?.toFixed(1) ?? "N/A"}
                  </p>
                  <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                </div>
              </div>
              {selectedMovie?.id === movie.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}
              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Movie Type */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Movie Type</label>
        <select
          value={movieType}
          onChange={(e) => setMovieType(e.target.value)}
          className="border border-gray-600 rounded-lg px-6 py-3 text-sm bg-transparent text-white"
        >
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Prices */}
      <div className="mt-8 flex flex-col md:flex-row gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Regular Price</label>
          <div className="inline-flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-md">
            <p className="text-gray-400 text-sm">{currency}</p>
            <input
              type="number"
              min={0}
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
              placeholder="Enter regular price"
              className="outline-none bg-transparent text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">VIP Price</label>
          <div className="inline-flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-md">
            <p className="text-gray-400 text-sm">{currency}</p>
            <input
              type="number"
              min={0}
              value={vipPrice}
              onChange={(e) => setVipPrice(e.target.value)}
              placeholder="Enter VIP price"
              className="outline-none bg-transparent text-white"
            />
          </div>
        </div>
      </div>

      {/* Hall & Date-Time */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Select Hall, Date & Time</label>
        <div className="flex flex-wrap items-center gap-5 mb-3">
          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="border border-amber-50 rounded-lg px-6 py-3 text-sm text-primary-dull bg-primary"
          >
            <option value="">Select Hall</option>
            {hallOptions.map((hall) => (
              <option key={hall} value={hall}>
                {hall}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={handleDateTimeChange}
            className="outline-none rounded-md text-sm"
            min={new Date().toISOString().slice(0, 16)}
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>

        <div className="border border-gray-600 p-3 rounded-lg">
          {Object.keys(dateTimeSelection).length === 0 && (
            <p className="text-sm text-gray-400">No showtimes added yet.</p>
          )}
        </div>
      </div>

      {/* Display Selected Halls */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Selected Hall, Date & Time</h2>
          <p className="text-gray-400 mb-4">🎬 {selectedMovie?.title}</p>

          <ul className="space-y-4">
            {Object.entries(dateTimeSelection).map(([hall, hallData]) => (
              <div key={hall} className="mb-4 border border-gray-700 rounded-lg p-4 bg-black/30">
                <h3 className="font-semibold text-primary text-lg mb-2">🏛️ Hall: {hall}</h3>
                {Object.entries(hallData).map(([date, times]) => (
                  <div key={date} className="flex flex-col gap-2">
                    <div className="font-medium text-gray-300">📅 {date}</div>
                    <div className="flex flex-wrap gap-2 mt-1 text-sm">
                      {times.map((time) => (
                        <div
                          key={time}
                          className="border border-primary px-3 py-1 flex items-center rounded"
                        >
                          ⏰ <span className="ml-1">{time}</span>
                          <TrashIcon
                            onClick={() => handleRemoveTime(hall, date, time)}
                            width={15}
                            className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all disabled:opacity-50"
      >
        {addingShow ? "Adding..." : "Add Show"}
      </button>
    </>
  );
};

export default AddShows;
