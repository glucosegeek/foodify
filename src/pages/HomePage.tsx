import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedRestaurants } from '../components/home/FeaturedRestaurants';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedRestaurants />
    </div>
  );
}