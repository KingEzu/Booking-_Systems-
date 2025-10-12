import { useState, useEffect } from "react"
import { dummyUpcomingMovies } from "../assets/assets"
import UpcomingMovieCard from "./UpcomingMovieCard"
import BlurCircle from "./BlurCircle"
import { ArrowLeft, ArrowRight } from "lucide-react"

const UpcomingSection = () => {
  const totalMovies = dummyUpcomingMovies.length
  const [startIndex, setStartIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [isDesktop, setIsDesktop] = useState(true)

  // Adjust items per page & desktop flag
  useEffect(() => {
 
     const handleResize = () => {
       const width = window.innerWidth
      if (width < 1280) { // anything below desktop
        setItemsPerPage(totalMovies) // show 1 card per slide
        setIsDesktop(false) // hide arrows
      } else {
        setItemsPerPage(3) // desktop: 3 cards per slide
        setIsDesktop(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [totalMovies])

  const nextSlide = () => {
    if (startIndex + itemsPerPage < totalMovies) {
      setStartIndex(startIndex + itemsPerPage)
    }
  }

  const prevSlide = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage)
    }
  }

  const visibleMovies = dummyUpcomingMovies.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden relative">
      <BlurCircle top="-100px" left="-100px" />


      {/* Section Title */}
      <div className="flex items-center justify-between pt-20 pb-10">
        <p className="text-gray-300 font-medium text-lg">
          <span className="inline-block text-3xl animate-bounce">⏳</span>
          <span className="text-gray-200 ml-2">Upcoming Movies</span>
        </p>
      </div>

      {/* No movies fallback */}
      {totalMovies === 0 ? (
        <p className="text-gray-400 text-center pb-10">
          There are no movies this week
        </p>
      ) : (
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Left Arrow (desktop only) */}
          {isDesktop && totalMovies > itemsPerPage && (
            <button
              onClick={prevSlide}
              disabled={startIndex === 0}
              className="p-2 bg-gray-700 rounded-full disabled:opacity-30"
            >
              <ArrowLeft className="text-white" />
            </button>
          )}

          {/* Movie Cards */}
          <div className={`flex gap-6 ${isDesktop ? "flex-1 justify-center" : "flex-wrap justify-center w-full"}`}>
            {visibleMovies.map((movie) => (
              <UpcomingMovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {/* Right Arrow (desktop only) */}
          {isDesktop && totalMovies > itemsPerPage && (
            <button
              onClick={nextSlide}
              disabled={startIndex + itemsPerPage >= totalMovies}
              className="p-2 bg-gray-700 rounded-full disabled:opacity-30"
            >
              <ArrowRight className="text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default UpcomingSection
