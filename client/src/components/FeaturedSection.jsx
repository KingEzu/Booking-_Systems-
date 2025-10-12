import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { dummyShowsData } from '../assets/assets';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const hasMovies = dummyShowsData && dummyShowsData.length > 0;
  const hasMoreThanFive = hasMovies && dummyShowsData.length > 5;

  return (
     <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden min-h-[80vh] bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* 🔆 Cinematic background lights */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-yellow-500/10 blur-3xl rounded-full bounce-slow" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-amber-400/10 blur-3xl rounded-full pulse-slow" />
      </div>
      <BlurCircle top="0px" right="90px" />
      {/* ✅ Only show header if movies exist */}
      {hasMovies && (
        <div className='flex items-center justify-between pt-20 pb-10'>
          <p className="text-gray-300 font-medium text-lg">
            <span className="inline-block text-3xl animate-bounce">🎬</span> 
            <span className="text-gray-200"> Now Showing</span>
          </p>

          {hasMoreThanFive && (
            <button
              onClick={() => navigate('/movies')}
              className='group flex items-center gap-2 text-sm text-amber-300 cursor-pointer hover:underline mt-2'
            >
              View All
              <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' />
            </button>
          )}
        </div>
      )}

      {/* ✅ Show movies if available, otherwise show message */}
      {hasMovies ? (
        <>
          <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
            {dummyShowsData.slice(0, 5).map((show) => (
              <MovieCard key={show._id} movie={show} />
            ))}
          </div>

          {hasMoreThanFive && (
            <div className='flex justify-center mt-20'>
            <button
  onClick={() => navigate('/movies')}
  className="px-10 py-3 mb-8 text-base bg-yellow-500 text-black font-semibold 
             rounded-full shadow-md hover:bg-primary hover:text-amber-50 hover:shadow-yellow-400/40 
             transition-all duration-300 transform hover:-translate-y-1 "
>
  Show More
</button>

            </div>
          )}
        </>
      ) : (
        <div className='flex flex-col items-center justify-center h-[50vh] space-y-4'>
          <div className='relative'>
            <span className='text-6xl animate-bounce'>🎬</span>
            <div className='absolute inset-0 blur-2xl bg-amber-400/20 rounded-full'></div>
          </div>

          <h1 className='text-3xl md:text-4xl font-bold text-center text-amber-300/90 d`rop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'>
            No Movies Available
          </h1>

          <p className='text-gray-400 text-center max-w-md'>
            Check back later for the latest shows — new movies are coming soon!
          </p>

        
        </div>
      )}
    </div>
  )
}

export default FeaturedSection
