export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  location: string;
  logo_url: string;
  rating: number;
  price_range: string;
  standout_dish: string;
  phone: string;
  website: string;
  dietary_options: string[];
  dining_style: string;
  review_count?: number;
  hours?: {
    [key: string]: string;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  spice_level?: 'mild' | 'medium' | 'hot' | 'very_hot';
}

export interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful_count?: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}