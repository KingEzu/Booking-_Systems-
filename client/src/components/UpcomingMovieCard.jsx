import { useNavigate } from "react-router-dom"
import TimeForamt from "../lib/TimeForamt"
import { Bell, Clock, Star } from "lucide-react"

const UpcomingMovieCard = ({ movie }) => {
  const navigate = useNavigate()

  if (!movie) return null

  return (
    <div
      className="relative flex flex-col items-center justify-center bg-gray-800 rounded-2xl hover:-translate-y-1 duration-300 w-[450px] h-[600px] cursor-pointer overflow-hidden"
      onClick={() => navigate(`/movie/${movie._id}`)}
    >
             {movie.genres.slice(0,2).map(g => g.name).join(" | ")}
      {/* 🔔 Reminder Bell Button - top-right of card */}
      <button
        className="absolute top-10 right-5 bg-black/60 p-2 rounded-full hover:bg-black/80 z-20"
        onClick={(e) => {
          e.stopPropagation()
          alert(`Reminder set for ${movie.title}`)
        }}
      >
        <Bell className="w-4 h-4 text-white" />
      </button>

      {/* ⭐ Vote Average - top-left */}
      <div className="absolute top-10 left-5 flex items-center gap-1 bg-primary/60 px-2 py-1 rounded-full z-20">
        <Star className="w-4 h-4 text-yellow-400" />
        <span className="text-white text-sm">{movie.vote_average.toFixed(1)}</span>
      </div>

      {/* 🎬 Poster */}
      <div className="relative w-full h-500">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className=" top-5 w-120 h-125 object-cover rounded-lg border-1"
        />
      </div>

      {/* Movie Info */}
      <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-2">
        <h3 className="text-white font-semibold">{movie.title}</h3>
        <div className="flex justify-between items-center">
          {/* Runtime with Clock Icon */}
          <div className="flex items-center gap-1 text-gray-300 text-sm">
            <Clock className="w-4 h-4" />
            <span>{TimeForamt(movie.runtime)}</span>
          </div>
          {/* Release Date */}
          <p className="text-gray-300 text-sm">{movie.release_date}</p>
        </div>
      </div>
    </div>
  )
}

export default UpcomingMovieCard



