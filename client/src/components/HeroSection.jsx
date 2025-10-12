import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketPlus } from "lucide-react";

const genres = [
  { name: 'Action', emoji: '🔥' },
  { name: 'Comedy', emoji: '😂' },
  { name: 'Thriller', emoji: '🕵️‍♂️' },
  { name: 'Horror', emoji: '👻' },
  { name: 'Sci-Fi', emoji: '🚀' },
];

const paragraphs = [
  "0Century Cinema isn’t just the top destination for movies—it’s also the perfect venue for your next big meeting! With our exceptional screens and sound systems, you can be sure that your message will be seen and heard clearly."
];

const HeroSection = () => {
  const [visibleGenres, setVisibleGenres] = useState(0);
  const [showHeading, setShowHeading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [displayedParagraphs, setDisplayedParagraphs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const startTyping = () => {
      let pIndex = 0;

      const typeNextParagraph = () => {
        if (pIndex >= paragraphs.length) return;
        const currentParagraph = paragraphs[pIndex];
        let charIndex = 0;

        setDisplayedParagraphs(prev => {
          const newParagraphs = [...prev];
          newParagraphs[pIndex] = '';
          return newParagraphs;
        });

        const interval = setInterval(() => {
          setDisplayedParagraphs(prev => {
            const newParagraphs = [...prev];
            newParagraphs[pIndex] = (newParagraphs[pIndex] || '') + (currentParagraph[charIndex] || '');
            return newParagraphs;
          });

          charIndex++;
          if (charIndex >= currentParagraph.length) {
            clearInterval(interval);
            pIndex++;
            typeNextParagraph();
          }
        }, 25);
      };

      typeNextParagraph();
    };

    // Show heading
    setTimeout(() => setShowHeading(true), 100);

    // Reveal genres one by one
    const genreAnimationDelay = 200; 
    const initialGenreDelay = 800; 

    genres.forEach((_, index) => {
      setTimeout(() => setVisibleGenres(prev => prev + 1), initialGenreDelay + index * genreAnimationDelay);
    });

    const totalEmojiTime = initialGenreDelay + (genres.length - 1) * genreAnimationDelay;

    // Start typing 0.5 sec after last emoji
    setTimeout(startTyping, totalEmojiTime + 500);

    // Show booking button after typing finishes
    const totalTypingTime = paragraphs.reduce((acc, p) => acc + p.length * 25, 0);
    setTimeout(() => setShowButton(true), totalEmojiTime + 500 + totalTypingTime);
  }, []);

  return (
    <div className="flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 h-screen text-white bg-[url('/backgroundImage.png')] bg-center md:bg-cover brightness-65">
      {showHeading && <h1 className="text-4xl md:text-6xl font-bold">Welcome to Century Cinema</h1>}

      <div className="flex gap-4 flex-wrap">
        {genres.slice(0, visibleGenres).map((genre, index) => (
          <span key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm md:text-base">
            {genre.emoji} {genre.name}
          </span>
        ))}
      </div>

      {displayedParagraphs.map((para, index) => (
        <p key={index} className="max-w-xl text-lg md:text-xl whitespace-pre-line">
          {para}
        </p>
      ))}

   {showButton && (
  <button
    onClick={() => navigate('/movies')}
    className="group mt-[10px] px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg flex items-center gap-2 hover:bg-[#014d4e] hover:text-yellow-500  transition relative"
  >
    {/* local keyframes + hover rule — keeps animation local to this component */}
    <style>{`
      @keyframes dance {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-3px) rotate(-10deg); }
        50% { transform: translateX(3px) rotate(10deg); }
        75% { transform: translateX(-3px) rotate(-5deg); }
      }

      /* ensure no unwanted transform origin */
      .dance { transform-origin: center; }

      /* animate once per hover */
      .group:hover .dance {
        animation: dance 0.6s ease-in-out 1;
      }

    `}</style>

    {/* icon has plain "dance" class — no Tailwind compound token */}
    <TicketPlus className="w-5 h-5 dance" />
    <span>Ticket</span>
  </button>
)}


    </div>
  );
};

export default HeroSection;
