import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedRestaurants } from '../components/home/FeaturedRestaurants';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to hash on page load/navigation
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      
      // Use requestAnimationFrame + setTimeout for better timing
      requestAnimationFrame(() => {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            // Get header height dynamically
            const header = document.querySelector('header');
            const headerHeight = header?.offsetHeight || 64;
            
            // Calculate position with offset
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
      // If no hash, scroll to top of page
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