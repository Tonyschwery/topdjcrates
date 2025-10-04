// components/FeaturedCratesCarousel.js
import React from 'react';
import Link from 'next/link';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const FeaturedCratesCarousel = ({ musicPacks }) => {
  return (
    <Swiper
      modules={[Autoplay, Navigation]}
      spaceBetween={30} // Space between cards
      slidesPerView={1}  // How many cards to show on mobile
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true, // Pauses the scroll on hover
      }}
      navigation={true} // Shows next/previous arrows
      breakpoints={{
        // Responsive settings
        640: { slidesPerView: 2 },  // 2 cards on screens >= 640px
        768: { slidesPerView: 3 },  // 3 cards on screens >= 768px
        1024: { slidesPerView: 4 }, // 4 cards on screens >= 1024px
      }}
      className="w-full"
    >
      {musicPacks.map((pack) => (
        <SwiperSlide key={pack.id}>
          <Link href="/music" passHref>
            {/* This is your exact card design from index.js */}
            <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full">
              <img src={pack.cover} alt={pack.title} className="w-full h-auto object-cover group-hover:opacity-80 transition-opacity" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-primary truncate">{pack.title}</h3>
                <p className="text-sm text-gray-400">{pack.artist || 'Various Artists'}</p>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedCratesCarousel;