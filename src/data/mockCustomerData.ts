// Types for customer data
export interface CustomerActivity {
  id: string;
  type: 'REVIEW' | 'PHOTO' | 'FAVORITE' | 'FOLLOW';
  restaurant_id: string;
  restaurant_name: string;
  restaurant_logo?: string;
  rating?: number;
  comment?: string;
  photos?: string[];
  created_at: string;
}

export interface FollowedRestaurant {
  id: string;
  name: string;
  logo_url?: string;
  cuisine_type: string;
  followed_at: string;
  latest_post?: {
    id: string;
    type: 'PROMOTION' | 'EVENT' | 'MENU_UPDATE';
    title: string;
    content: string;
    image_url?: string;
    created_at: string;
  };
  new_posts_count: number;
}

export interface FavoriteList {
  id: string;
  name: string;
  description?: string;
  restaurants: FavoriteRestaurant[];
  created_at: string;
  is_public: boolean;
}

export interface FavoriteRestaurant {
  id: string;
  name: string;
  logo_url?: string;
  cuisine_type: string;
  rating: number;
  price_range: string;
  added_at: string;
  note?: string;
}

export interface CustomerNotification {
  id: string;
  type: 'RESTAURANT_REPLY' | 'NEW_FOLLOWER' | 'RESTAURANT_POST' | 'FRIEND_REVIEW';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  related_id?: string;
  actor_name?: string;
  actor_avatar?: string;
}

// Mock data
export const mockCustomerActivities: CustomerActivity[] = [
  {
    id: '1',
    type: 'REVIEW',
    restaurant_id: '1',
    restaurant_name: 'Bella Vista Italian',
    restaurant_logo: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Amazing truffle risotto! The atmosphere was perfect for a romantic dinner. Service was impeccable.',
    photos: [
      'https://images.unsplash.com/photo-1563379091339-03246963d51f?w=400',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400'
    ],
    created_at: '2024-01-15T19:30:00Z'
  },
  {
    id: '2',
    type: 'PHOTO',
    restaurant_id: '2',
    restaurant_name: 'Sakura Sushi Bar',
    restaurant_logo: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=100',
    photos: ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'],
    created_at: '2024-01-14T18:15:00Z'
  },
  {
    id: '3',
    type: 'FAVORITE',
    restaurant_id: '3',
    restaurant_name: 'Green Leaf Café',
    restaurant_logo: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100',
    created_at: '2024-01-13T12:00:00Z'
  },
  {
    id: '4',
    type: 'FOLLOW',
    restaurant_id: '4',
    restaurant_name: 'The Grill House',
    restaurant_logo: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=100',
    created_at: '2024-01-12T16:45:00Z'
  }
];

export const mockFollowedRestaurants: FollowedRestaurant[] = [
  {
    id: '1',
    name: 'Bella Vista Italian',
    logo_url: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine_type: 'Italian',
    followed_at: '2024-01-01T00:00:00Z',
    latest_post: {
      id: '1',
      type: 'PROMOTION',
      title: 'Happy Hour Special! 🍷',
      content: 'Join us for our new happy hour menu! 20% off all appetizers and wine from 5-7 PM.',
      image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
      created_at: '2024-01-20T15:00:00Z'
    },
    new_posts_count: 2
  },
  {
    id: '2',
    name: 'Sakura Sushi Bar',
    logo_url: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine_type: 'Japanese',
    followed_at: '2024-01-05T00:00:00Z',
    latest_post: {
      id: '2',
      type: 'MENU_UPDATE',
      title: 'New Winter Menu Available! ❄️',
      content: 'Try our seasonal winter rolls and warm sake selection. Limited time only!',
      image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      created_at: '2024-01-19T12:00:00Z'
    },
    new_posts_count: 1
  },
  {
    id: '3',
    name: 'Green Leaf Café',
    logo_url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine_type: 'Vegan',
    followed_at: '2024-01-10T00:00:00Z',
    new_posts_count: 0
  }
];

export const mockFavoriteLists: FavoriteList[] = [
  {
    id: '1',
    name: 'Wege miejsca',
    description: 'Moje ulubione restauracje z opcjami wegańskimi i wegetariańskimi',
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    restaurants: [
      {
        id: '13',
        name: 'Green Leaf Café',
        logo_url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100',
        cuisine_type: 'Vegan',
        rating: 4.4,
        price_range: '$$',
        added_at: '2024-01-13T12:00:00Z',
        note: 'Najlepsze jackfruit carnitas w mieście!'
      },
      {
        id: '7',
        name: 'Mediterranean Breeze',
        logo_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100',
        cuisine_type: 'Mediterranean',
        rating: 4.7,
        price_range: '$$$',
        added_at: '2024-01-10T15:30:00Z',
        note: 'Świetne opcje wegańskie, piękny taras'
      }
    ]
  },
  {
    id: '2',
    name: 'Randki',
    description: 'Romantyczne miejsca na szczególne okazje',
    is_public: false,
    created_at: '2024-01-05T00:00:00Z',
    restaurants: [
      {
        id: '1',
        name: 'Bella Vista Italian',
        logo_url: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=100',
        cuisine_type: 'Italian',
        rating: 4.8,
        price_range: '$$$',
        added_at: '2024-01-15T19:30:00Z',
        note: 'Idealne na rocznicę'
      },
      {
        id: '14',
        name: 'Ocean\'s Bounty',
        logo_url: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=100',
        cuisine_type: 'Seafood',
        rating: 4.8,
        price_range: '$$$$',
        added_at: '2024-01-08T20:00:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Szybki lunch',
    description: 'Miejsca na szybki i dobry lunch w centrum',
    is_public: true,
    created_at: '2024-01-12T00:00:00Z',
    restaurants: [
      {
        id: '8',
        name: 'Taco Libre',
        logo_url: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=100',
        cuisine_type: 'Mexican',
        rating: 4.4,
        price_range: '$',
        added_at: '2024-01-12T13:00:00Z'
      }
    ]
  }
];

export const mockCustomerNotifications: CustomerNotification[] = [
  {
    id: '1',
    type: 'RESTAURANT_REPLY',
    title: 'Bella Vista odpowiedziała na Twoją recenzję',
    message: 'Dziękujemy za wspaniałą recenzję! Cieszymy się, że spodobał Ci się nasz truffle risotto.',
    read: false,
    created_at: '2024-01-20T10:30:00Z',
    related_id: '1',
    actor_name: 'Bella Vista Italian',
    actor_avatar: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=50'
  },
  {
    id: '2',
    type: 'NEW_FOLLOWER',
    title: 'Nowy obserwujący',
    message: 'mario_chef zaczął Cię obserwować',
    read: false,
    created_at: '2024-01-19T16:45:00Z',
    actor_name: 'mario_chef',
    actor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: '3',
    type: 'RESTAURANT_POST',
    title: 'Sakura Sushi ma nowy post',
    message: 'Sprawdź nasze nowe zimowe menu!',
    read: true,
    created_at: '2024-01-19T12:00:00Z',
    related_id: '2',
    actor_name: 'Sakura Sushi Bar',
    actor_avatar: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=50'
  },
  {
    id: '4',
    type: 'FRIEND_REVIEW',
    title: 'anna_food oceniła nową restaurację',
    message: 'Sprawdź recenzję Mexican Cantina - może Ci się spodoba!',
    read: true,
    created_at: '2024-01-18T14:20:00Z',
    actor_name: 'anna_food',
    actor_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b932c5af?w=50&h=50&fit=crop&crop=face'
  }
];