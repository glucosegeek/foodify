import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedRestaurants } from '../components/home/FeaturedRestaurants';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            const header = document.querySelector('header');
            const headerHeight = header?.offsetHeight || 64;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 150);
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.hash, location.pathname]);

  return (
    <div>
      <HeroSection />
      <FeaturedRestaurants />
    </div>
  );
}
