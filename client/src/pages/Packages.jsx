import React from "react";
import { 
  Briefcase, 
  Film, 
  School, 
  PartyPopper, 
  Building2, 
  Popcorn 
} from "lucide-react";

import { assets } from "../assets/assets"; // Make sure all images are imported in assets.js

const packagesData = [
  {
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Business Meetings",
    desc: "Bored of the same old meeting rooms? Looking for a fresh, exciting setting? Host your next meeting at Century Cinema. Picture the impact of a private auditorium featuring a massive wall-to-wall screen, Dolby Digital surround sound, and the latest digital projection technology. It’s guaranteed to elevate your event and leave a lasting impression. Want to add some fun? Wrap up with a movie after your meeting!",
    image: assets.businessPac
  },
  {
    icon: <Film className="w-10 h-10 text-primary" />,
    title: "Private Screenings",
    desc: "Now booking private rentals for groups of 200 or more! Whether it’s an employee incentive, birthday party, or a gathering with friends and family, there’s no better way to celebrate than in your very own private auditorium. For more details, reach out to your local theatre directly or fill out the form below, and someone will get in touch with you. After all, who doesn’t love a night out at the movies?",
    image: assets.privateScreening
  },
  {
    icon: <School className="w-10 h-10 text-primary" />,
    title: "School Packages",
    desc: "All kids love going to the movies! What better way to reward or motivate them than with a fun trip to the theater? You can plan your school package at a time that works best for you, as we’re available to accommodate your schedule. We offer special discount packages for groups of 200 or more, which can include popcorn or a drink. We can also have concessions ready and waiting, so students can pick their favorite snacks.",
    image: assets.schoolPackage
  },
  {
    icon: <PartyPopper className="w-10 h-10 text-primary" />,
    title: "Special Events & Parties",
    desc: "Looking for the perfect venue to celebrate the holidays or a special occasion? Your search ends here. Our experienced team is ready to assist in planning your event and ensuring it’s truly unforgettable.",
    image: assets.specialEvent
  },
  {
    icon: <Building2 className="w-10 h-10 text-primary" />,
    title: "Corporate Celebrations",
    desc: "Appreciate your valued clients, or celebrate a special occasion with a movie! You can offer guests popcorn and other snacks, or even book a dine-in theater for a complete restaurant-style experience. Enjoy a recent film, all in a setting with premium sight, sound, and seating.",
    image: assets.compare
  },
  {
    icon: <Popcorn className="w-10 h-10 text-primary" />,
    title: "Movie Packages",
    desc: "Reserve a private auditorium for an exclusive film screening with your invited guests. With a private event, you have the flexibility to customize every detail—from choosing the time and date to selecting the auditorium size and adding extra time in the theater.",
    // no image for movie packages
  },
];

const Packages = () => {
  return (
    <section className="py-10 px-5 md:px-20">
      <h2 className="text-3xl font-bold text-center mb-10">Our Packages</h2>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {packagesData.map((pkg, index) => (
          <div key={index} className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            {pkg.image && (
              <img 
                src={pkg.image} 
                alt={pkg.title} 
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <div className="mb-4">{pkg.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
            <p className="text-gray-600">{pkg.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Packages;
