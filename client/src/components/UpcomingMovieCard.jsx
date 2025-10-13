import { useNavigate } from "react-router-dom";
import TimeForamt from "../lib/TimeForamt";
import { Bell, Clock, StarIcon } from "lucide-react";

const UpcomingMovieCard = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <div className="group flex flex-col justify-between bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-yellow-500/20 hover:-translate-y-1 transition-transform duration-300 w-84 border-2 border-amber-500/15 ">
      
      {/* Poster Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img
          onClick={() => {
            navigate(`/movie/${movie._id}`);
            window.scrollTo(0, 0);
          }}
          src={movie.backdrop_path || '/images/default-poster.jpg'}
          alt={movie.title || 'Movie Poster'}
          className="w-full h-full object-cover object-center rounded-t-2xl transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />

        {/* Top-left Vote */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary/60 px-2 py-1 rounded-full z-20">
          <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>

        {/* Top-right Bell */}
        <button
          className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:bg-black/80 z-20"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Reminder set for ${movie.title}`);
          }}
        >
          <Bell className="w-4 h-4 text-white" />
        </button>

        {/* Soft yellow ring glow */}
        <div className="absolute inset-0 ring-1 ring-yellow-500/30 group-hover:ring-yellow-400/60 rounded-t-2xl transition duration-300"></div>
      </div>

      {/* Movie Info */}
      <div className="p-4 flex flex-col flex-grow space-y-1">
        {/* First line: Title (left), Release Year (right) */}
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg text-white truncate">{movie.title}</p>
          <span className="text-sm text-gray-400">{new Date(movie.release_date).getFullYear()}</span>
        </div>

        {/* Second line: Genres (left), Language (center), Runtime (right) */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span className="truncate">{movie.genres.slice(0, 2).map((g) => g.name).join(' | ')}</span>
          <span>{movie.language}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{TimeForamt(movie.runtime)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMovieCard;
