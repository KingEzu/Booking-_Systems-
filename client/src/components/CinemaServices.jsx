import { useState } from "react";
import { Briefcase, Film, School, PartyPopper, Building2, Popcorn, Plus, Minus } from "lucide-react";

const services = [
  {
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Business Meetings",
    desc: "Bored of the same old meeting rooms? Looking for a fresh, exciting setting? Host your next meeting at Century Cinema. Picture the impact of a private auditorium featuring a massive wall-to-wall screen, Dolby Digital surround sound, and the latest digital projection technology. It’s guaranteed to elevate your event and leave a lasting impression. Want to add some fun? Wrap up with a movie after your meeting!"
  },
  {
    icon: <Film className="w-10 h-10 text-primary" />,
    title: "Private Screenings",
    desc: "Now booking private rentals for groups of 200 or more! Whether it’s an employee incentive, birthday party, or a gathering with friends and family, there’s no better way to celebrate than in your very own private auditorium. For more details, reach out to your local theatre directly or fill out the form below, and someone will get in touch with you. After all, who doesn’t love a night out at the movies?"
  },
  {
    icon: <School className="w-10 h-10 text-primary" />,
    title: "School Packages",
    desc: "All kids love going to the movies! What better way to reward or motivate them than with a fun trip to the theater? You can plan your school package at a time that works best for you, as we’re available to accommodate your schedule. We offer special discount packages for groups of 200 or more, which can include popcorn or a drink. We can also have concessions ready and waiting, so students can pick their favorite snacks."
  },
  {
    icon: <PartyPopper className="w-10 h-10 text-primary" />,
    title: "Special Events & Parties",
    desc: "Looking for the perfect venue to celebrate the holidays or a special occasion? Your search ends here. Our experienced team is ready to assist in planning your event and ensuring it’s truly unforgettable."
  },
  {
    icon: <Building2 className="w-10 h-10 text-primary" />,
    title: "Corporate Celebrations",
    desc: "Appreciate your valued clients, or celebrate a special occasion with a movie! You can offer guests popcorn and other snacks, or even book a dine-in theater for a complete restaurant-style experience. Enjoy a recent film, all in a setting with premium sight, sound, and seating."
  },
  {
    icon: <Popcorn className="w-10 h-10 text-primary" />,
    title: "Movie Packages",
    desc: "Reserve a private auditorium for an exclusive film screening with your invited guests. With a private event, you have the flexibility to customize every detail—from choosing the time and date to selecting the auditorium size and adding extra time in the theater."
  },
];

export default function CinemaServices() {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (title) => {
    setExpandedCards(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <section className="py-20 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-wide mb-4">
          More Than Just Movies
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Our cinema offers a variety of premium services designed to make every experience special.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {services.map((service) => {
          const isExpanded = expandedCards[service.title] || false;
          const needsExpand = service.desc.length > 300;

          return (
            <div
              key={service.title}
              className="group p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-primary hover:shadow-[0_0_25px_-5px_rgba(255,200,0,0.5)] transition-all duration-300"
            >
              <div className="mb-6 flex items-center justify-center">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-center group-hover:text-primary transition">
                {service.title}
              </h3>

              <p
                className={`text-gray-400 text-justify transition-[max-height] duration-500 overflow-hidden ${
                  !isExpanded && needsExpand ? "line-clamp-3" : "line-clamp-none"
                }`}
              >
                {service.desc}
              </p>

              {/* Show More / Show Less button aligned to right */}
              {needsExpand && (
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => toggleExpand(service.title)}
                    className="flex items-center gap-2 text-primary hover:text-amber-400 transition font-medium"
                  >
                    {isExpanded ? (
                      <>
                        <Minus className="w-4 h-4" /> Show Less
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Show More
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
