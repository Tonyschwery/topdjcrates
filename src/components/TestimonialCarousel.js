import React, { useState, useEffect, useCallback } from 'react';

const TestimonialCarousel = () => {
  const [testimonials] = useState([
    { id: 1, quote: "The quality of these crates is insane. My sets have never sounded better. A must-have for any serious DJ.", author: "DJ Rico", location: "Miami, USA" },
    { id: 2, quote: "Saves me hours of digging for tracks. Every pack is full of bangers. Highly recommended!", author: "Anabel", location: "Berlin, Germany" },
    { id: 3, quote: "Finally, a service that understands what DJs actually need. The tracks are fire and ready to play.", author: "Carlos V.", location: "Ibiza, Spain" }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    // Section now has a transparent background to blend into the page.
    <section id="testimonials" className="container mx-auto py-16 px-4 md:px-8">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-16">
        What DJs Are Saying
      </h2>
      <div className="relative max-w-3xl mx-auto">
        <div className="overflow-hidden relative h-48">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex flex-col items-center justify-center text-center h-full p-4">
                <p className="text-xl md:text-2xl text-text italic">"{testimonial.quote}"</p>
                <p className="mt-4 text-lg font-bold text-primary">{testimonial.author}</p>
                <p className="text-sm text-gray-400">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel buttons updated for the dark theme */}
        <button 
          onClick={prevSlide} 
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 sm:-translate-x-12 bg-zinc-800 p-2 rounded-full text-white hover:bg-zinc-700 transition-colors"
          aria-label="Previous testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 sm:translate-x-12 bg-zinc-800 p-2 rounded-full text-white hover:bg-zinc-700 transition-colors"
          aria-label="Next testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
};

export default TestimonialCarousel;