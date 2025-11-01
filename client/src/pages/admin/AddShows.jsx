import React, { useEffect, useState } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Title from './Title';
import { CheckIcon, StarIcon, TrashIcon } from '@heroicons/react/16/solid';
import Loading from '../../components/Loading'; 
import { kConverter } from '../../lib/kConverter';
import toast from "react-hot-toast";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURENCY; 
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showPrice, setShowPrice] = useState('');
  const [selectedHall, setSelectedHall] = useState('');

  const hallOptions = ["C1", "C2", "C3"];

  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

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

  const handleDateTimeAdd = () => {
    if (!selectedHall) {
      toast.error("Please select a hall!");
      return;
    }
    if (!dateTimeInput) {
      toast.error("Please select a date and time!");
      return;
    }

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

    setDateTimeInput(''); // optional: clear input after adding
  };

  const handleRemoveTime = (hall, date, time) => {
    setDateTimeSelection((prev) => {
      const hallData = { ...prev[hall] };
      const filteredTimes = hallData[date].filter((t) => t !== time);

      if (filteredTimes.length === 0) {
        delete hallData[date];
      } else {
        hallData[date] = filteredTimes;
      }

      const updated = { ...prev, [hall]: hallData };
      if (Object.keys(hallData).length === 0) delete updated[hall];

      return updated;
    });
  };

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover-translate-y-1 transition duration-300`}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full object-cover brightness-90"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary-dull" />
                    {movie.vote_average?.toFixed(1) ?? 'N/A'}
                  </p>
                  <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                </div>
              </div>

              {selectedMovie === movie.id && (
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

      {/* Show Price Input */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border broder-gray-600 px-4 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="enter the show price"
            className="outline-none"
          />
        </div>
      </div>

      {/* Date & Time */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Select Hall, Date & Time</label>

        {/* Flex row OUTSIDE of border */}
        <div className="flex flex-wrap items-center gap-5 mb-3">
          {/* Hall Select */}
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

          {/* Date-Time Input */}
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={handleDateTimeChange}
            className="outline-none rounded-md text-sm"
            min={new Date().toISOString().slice(0, 16)}
          />

          {/* Add Button */}
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
            type="button"
          >
            Add Time
          </button>
        </div>

        {/* Border for showtimes only */}
        <div className="border border-gray-600 p-3 rounded-lg">
          {Object.keys(dateTimeSelection).length === 0 && (
            <p className="text-sm text-gray-400">No showtimes added yet.</p>
          )}
        </div>
      </div>

      {/* Display Selected Halls, Dates & Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Hall, Date & Time</h2>

          <ul className="space-y-4">
            {Object.entries(dateTimeSelection).map(([hall, hallData]) => (
              <div key={hall} className="mb-4 border-b border-gray-700 pb-3">
                <h3 className="font-semibold text-primary mb-2">{hall}</h3>

                {Object.entries(hallData).map(([date, times]) => (
                  <div key={date} className="flex flex-col gap-2">
                    <div className="font-medium text-gray-300">{date}</div>

                    <div className="flex flex-wrap gap-2 mt-1 text-sm">
                      {times.map((time) => (
                        <div
                          key={time}
                          className="border border-primary px-2 py-1 flex items-center rounded"
                        >
                          <span>{time}</span>
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

      <button className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>
          Add Show
      </button>


    </>
  ) : (
    <Loading />
  );
};

export default AddShows;
