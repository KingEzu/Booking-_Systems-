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
    }, 1000); // simulate 1s fetch delay

    const notFoundTimer = setTimeout(() => {
      if (!show) setNotFound(true);
    }, 10000); // 10s fallback to not found

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
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      {/* Movie details content */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="max-md:mx-auto rounded-xl h-[420px] w-full md:w-[320px] object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-50px" right="-50px" />

          <div className="flex justify-between items-center">
            <p className="text-primary-dull/78 uppercase underline">{movie.language}</p>
            <p className="text-primary-dull bg-primary uppercase border-1 py-1 px-5 border-amber-50/50 rounded">
              {movie.playGround}
            </p>
          </div>

          <h1 className="text-4xl font-semibold max-w-96 text-balance">{movie.title}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary-dull" />
            {movie.vote_average?.toFixed(1) || 'N/A'} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl italic">
            {movie.overview}
          </p>

          <p className="text-gray-300 text-sm">
            {TimeFormat(movie.runtime)} ·{' '}
            {movie.genres?.map((genre) => genre.name).join(', ') || 'No genres'} ·{' '}
            {show.movie.release_date.split('-')[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
                <PlayCircleIcon className='w-5 h-5'/>
                Watch Trailer
            </button>
            <a href='#dateSelect' className='px-10 py-3 text-sm bg-primary-dull/85 text-black/95 hover:bg-primary hover:text-amber-50 transition rounded-md font-medium cursor-pointer active:scale-95'>
              Buy Tickets
            </a>
            <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
                <Heart className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

      <p className='text-lg font-medium mt-20'>Cast</p>
      <div className="overflow-x-auto no-scrollbar flex gap-4 pb-4 mt-8">
        <div className="flex items-center gap-4 w-max px-4">
          {show.movie.casts.slice(0, 9).map((cast, index) => (
            <div key={index} className='flex flex-col items-center text-center'>
              <img src={cast.profile_path} alt='cast' className='rounded-full h-15 md:h-15 aspect-square object-cover'/>
              <p className='font-medium text-xs mt-3'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />
    </div>
  );
};

export default MovieDetails;
