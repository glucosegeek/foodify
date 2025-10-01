import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedRestaurants } from '../components/home/FeaturedRestaurants';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to hash on page load
    if (location.hash === '#top-restaurants') {
      setTimeout(() => {
        document.getElementById('top-restaurants')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [location]);

  return (
    <div>
      <HeroSection />
      <FeaturedRestaurants />
    </div>
  );
}