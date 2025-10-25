import React, { useState } from 'react';
import CinemaServices from '../components/CinemaServices';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How can I book a private screening?",
    answer: "You can reserve through our 'Reserve Now' button under each package, or visit our box office to schedule your event. We'll help you customize the screening to your needs."
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes! We provide special discounts for schools, businesses, and large groups. Contact our team to learn more about group rates and available packages."
  },
  {
    question: "Can I bring outside food or drinks?",
    answer: "Outside food and drinks are not allowed. However, we offer a wide range of snacks, soft drinks, and popcorn packages available at the concession stand."
  },
  {
    question: "Do you host birthday parties?",
    answer: "Absolutely! Our birthday package includes private screening options, decorations, and catering. You can also customize your experience."
  },
  {
    question: "Is there parking available at the cinema?",
    answer: "Yes, we have free on-site parking for all visitors, including reserved spaces for private events."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-wide mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Find quick answers to the most common questions about our packages and cinema services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-800 rounded-2xl p-5 bg-gray-900 hover:border-primary transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left"
            >
              <span className="text-lg font-semibold text-gray-200">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="text-primary w-6 h-6" />
              ) : (
                <ChevronDown className="text-primary w-6 h-6" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === index ? "max-h-40 mt-3" : "max-h-0"
              }`}
            >
              <p className="text-gray-400 text-base leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Packages = () => {
  return (
    <div id="CinemaServices" className="mt-0">
      <CinemaServices />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default Packages;
