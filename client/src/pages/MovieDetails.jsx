import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import { StarIcon } from '@heroicons/react/24/solid';
import TimeFormat from '../lib/TimeForamt';
import { Heart, PlayCircleIcon } from 'lucide-react';
import DateSelect from '../components/DateSelect';
import Loading from '../components/Loading';

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setShow(null);
    setLoading(true);
    setNotFound(false);

    const fetchTimer = setTimeout(() => {
      const foundShow = dummyShowsData.find((s) => s._id === id);
      if (foundShow) {
        setShow({ movie: foundShow, dateTime: dummyDateTimeData });
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 1000);

    const notFoundTimer = setTimeout(() => {
      if (!show) setNotFound(true);
    }, 10000);

    return () => {
      clearTimeout(fetchTimer);
      clearTimeout(notFoundTimer);
    };
  }, [id]);

  if (loading && !notFound) {
    return (
      <div className="text-center text-gray-300 mt-20 text-lg">
        <Loading />
      </div>
    );
  }

  if (notFound && !show) {
    return (
      <div className="flex flex-col items-center justify-center mt-40 mb-40 text-center px-10 py-12 bg-transparent rounded-2xl shadow-lg max-w-md mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-amber-800/90 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-white mb-2">Sorry!</h2>
        <p className="text-gray-300 text-lg">
          Movie not found. Please check the link or try again later.
        </p>
      </div>
    );
  }

  const movie = show.movie;

  return (
    <div className="relative w-full overflow-y-hidden px-4 max-lg:px-6 pt-10 max-lg:pt-20 overflow-x-hidden bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Movie details content */}
      <div className="flex flex-col mt-5 lg:mt-25 max-lg:flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Poster */}
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="mx-auto max-lg:mt-10 rounded-xl w-full max-w-[320px] h-auto object-cover"
        />

        {/* Details Column */}
        <div className="relative lg:mt-10 flex flex-col gap-3 flex-1 min-w-0 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <BlurCircle top="-50px" right="-50px" />
          </div>

          <div className="relative mt-4 z-20">
            <div className="flex justify-between items-center">
              <p className="text-primary-dull/78 uppercase underline">{movie.language}</p>
              <p className="text-primary-dull bg-primary uppercase border py-1 px-5 border-amber-50/50 rounded">
                {movie.playGround}
              </p>
            </div>

            <h1 className="text-4xl font-semibold max-w-96 text-balance mt-2">{movie.title}</h1>

            <div className="flex items-center gap-2 text-gray-300 mt-1">
              <StarIcon className="w-5 h-5 text-primary fill-primary-dull" />
              {movie.vote_average?.toFixed(1) || 'N/A'} User Rating
            </div>

            <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl italic">
              {movie.overview}
            </p>

            <p className="text-gray-300 text-sm mt-2">
              {TimeFormat(movie.runtime)} ·{' '}
              {movie.genres?.map((genre) => genre.name).join(', ') || 'No genres'} ·{' '}
              {movie.release_date?.split('-')[0]}
            </p>

            {/* Buttons */}
            <div className="flex flex-col max-lg:flex-col sm:flex-row items-center gap-4 mt-4">
              <button className="flex items-center justify-center w-full sm:w-auto gap-2 px-7 py-3 text-sm bg-gray-900 rounded-md font-medium active:scale-95">
                <PlayCircleIcon className="w-5 h-5" />
                Watch Trailer
              </button>

              <a
                href="#dateSelect"
                className="w-full sm:w-auto px-10 py-3 text-sm bg-primary-dull/85 text-black/95 hover:bg-primary hover:text-amber-50 rounded-md font-medium text-center"
              >
                Buy Tickets
              </a>

              <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cast List */}
  <div
  className="
    relative
    mt-18 w-full
    overflow-x-auto
    sm:overflow-x-auto
    md:overflow-x-auto
    lg:overflow-x-auto
    
    xl:overflow-x-hidden
  "
>
  <div
    className="
      flex gap-6 px-6
      sm:inline-flex
      md:inline-flex
      lg:inline-flex
      xl:flex-wrap
      justify-start
      items-center
      no-scrollbar
      xl:ml-50
    "
  >
    {show.movie.casts.slice(0, 10).map((cast, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center text-center flex-shrink-0"
      >
        <img
          src={cast.profile_path}
          alt={cast.name}
          className="
            rounded-full
            h-24 w-24
            sm:h-24 sm:w-24
            md:h-28 md:w-28
            lg:h-32 lg:w-32
            object-cover border-primary-dull border-2
          "
        />
        <p className="font-medium text-xs mt-3">{cast.name}</p>
      </div>
    ))}
  </div>
</div>


      {/* Date Selection */}
      <div id="dateSelect" className="mt-5 lg:px-15 py-5 xl:px-75">
        <DateSelect dateTime={show.dateTime} id={id} />
      </div>
    </div>
  );
};

export default MovieDetails;
