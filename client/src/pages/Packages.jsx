import React, { useState } from "react";
import { 
  Briefcase, 
  Film, 
  School, 
  PartyPopper, 
  Building2, 
  Popcorn 
} from "lucide-react";
import { assets } from "../assets/assets";

const packagesData = [
  {
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Business Meetings",
    desc: "Bored of the same old meeting rooms? Host your next meeting at Century Cinema...",
    image: assets.businessPac,
    schedule: "Mon-Fri 9am - 6pm"
  },
  {
    icon: <Film className="w-10 h-10 text-primary" />,
    title: "Private Screenings",
    desc: "Now booking private rentals for groups of 200 or more! ...",
    image: assets.privateScreening,
    schedule: "Available Daily"
  },
  {
    icon: <School className="w-10 h-10 text-primary" />,
    title: "School Packages",
    desc: "All kids love going to the movies! ...",
    image: assets.schoolPackage,
    schedule: "Mon-Fri 8am - 2pm"
  },
  {
    icon: <PartyPopper className="w-10 h-10 text-primary" />,
    title: "Special Events & Parties",
    desc: "Looking for the perfect venue to celebrate ...",
    image: assets.specialEvent,
    schedule: "Weekends & Holidays"
  },
  {
    icon: <Building2 className="w-10 h-10 text-primary" />,
    title: "Corporate Celebrations",
    desc: "Appreciate your valued clients ...",
    image: assets.compare,
    schedule: "Mon-Sat 10am - 8pm"
  },
];

const Packages = () => {
  const [activeIndex, setActiveIndex] = useState(null); // tracks which package is expanded

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // toggle expand/collapse
  };

  return (
    <section className="py-10 px-5 md:px-20">
      <h2 className="text-3xl font-bold text-center mb-10">Our Packages</h2>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {packagesData.map((pkg, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="cursor-pointer relative rounded-lg overflow-hidden border shadow hover:shadow-lg transition"
          >
            {/* Image + Title */}
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 bg-primary/10">
              <h3 className="text-xl font-semibold">{pkg.title}</h3>
            </div>

            {/* Expanded content */}
            {activeIndex === index && (
              <div className="p-4 bg-white border-t">
                <p className="text-gray-700 mb-2">{pkg.desc}</p>
                <p className="text-gray-500 font-medium">Schedule: {pkg.schedule}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Packages;
