
import { Restaurant, Review } from './types';

const MOCK_REVIEWS: Review[] = [
  { id: 'rev-1', userName: 'Alex J.', rating: 5, comment: 'Absolutely phenomenal. The flavors were perfectly balanced!', date: '2024-03-10' },
  { id: 'rev-2', userName: 'Sarah M.', rating: 4, comment: 'Great portions and very fresh. Arrived hot!', date: '2024-03-08' },
  { id: 'rev-3', userName: 'Chris P.', rating: 5, comment: 'The best I have had in the city. Highly recommend the signature dish.', date: '2024-03-05' },
  { id: 'rev-4', userName: 'Emma W.', rating: 3, comment: 'Decent food, but delivery took a bit longer than expected.', date: '2024-03-01' }
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    name: 'Gourmet Grill',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    cuisine: ['Burgers', 'American', 'Grill'],
    featured: true,
    reviews: MOCK_REVIEWS,
    location: { lat: 40.7128, lng: -74.0060 },
    menu: [
      { id: 'm-1-1', name: 'Signature Truffle Burger', description: 'Wagyu beef, truffle aioli, caramelized onions, brioche bun', price: 18.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', category: 'Main', rating: 4.9, calories: 850, reviews: [MOCK_REVIEWS[0]] },
      { id: 'm-1-2', name: 'Crispy Sweet Potato Fries', description: 'Hand-cut, sea salt, chipotle mayo', price: 6.99, image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=400', category: 'Sides', rating: 4.7, calories: 320 },
      { id: 'm-1-3', name: 'Cobb Salad Deluxe', description: 'Avocado, bacon, egg, blue cheese, ranch', price: 14.50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400', category: 'Salads', rating: 4.5, calories: 540 }
    ]
  },
  {
    id: 'res-2',
    name: 'Sushi Zen',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    deliveryTime: '35-45 min',
    deliveryFee: 3.50,
    cuisine: ['Japanese', 'Sushi', 'Seafood'],
    reviews: MOCK_REVIEWS.slice(0, 2),
    location: { lat: 40.7306, lng: -73.9352 },
    menu: [
      { id: 'm-2-1', name: 'Dragon Roll', description: 'Tempura shrimp, eel, avocado, kabayaki sauce', price: 16.50, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&q=80&w=400', category: 'Sushi', rating: 4.9, calories: 420 },
      { id: 'm-2-2', name: 'Salmon Sashimi (6pc)', description: 'Fresh Atlantic salmon, wasabi, ginger', price: 12.00, image: 'https://images.unsplash.com/photo-1534482421-0d45a48a73fe?auto=format&fit=crop&q=80&w=400', category: 'Appetizers', rating: 4.8, calories: 180 },
      { id: 'm-2-3', name: 'Miso Ramen', description: 'Chashu pork, bamboo shoots, soft egg', price: 14.99, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400', category: 'Main', rating: 4.7, calories: 720 }
    ]
  },
  {
    id: 'res-3',
    name: 'Pasta Palace',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    deliveryTime: '25-35 min',
    deliveryFee: 1.99,
    cuisine: ['Italian', 'Pasta', 'Pizza'],
    reviews: MOCK_REVIEWS.slice(2, 4),
    location: { lat: 40.7061, lng: -73.9969 },
    menu: [
      { id: 'm-3-1', name: 'Fettuccine Alfredo', description: 'Creamy parmesan sauce, parsley, garlic', price: 15.99, image: 'https://images.unsplash.com/photo-1645112481338-3560e9083bc7?auto=format&fit=crop&q=80&w=400', category: 'Main', rating: 4.6, calories: 920 },
      { id: 'm-3-2', name: 'Margherita Pizza', description: 'San Marzano tomatoes, fresh mozzarella, basil', price: 13.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400', category: 'Pizza', rating: 4.8, calories: 840 },
      { id: 'm-3-3', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 7.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=400', category: 'Dessert', rating: 4.9, calories: 450 }
    ]
  },
  {
    id: 'res-4',
    name: 'Taco Haven',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    deliveryTime: '15-25 min',
    deliveryFee: 0.99,
    cuisine: ['Mexican', 'Tacos'],
    reviews: MOCK_REVIEWS,
    location: { lat: 40.7589, lng: -73.9851 },
    menu: [
      { id: 'm-4-1', name: 'Street Tacos (3pc)', description: 'Asada, carnitas, or pollo, onions, cilantro', price: 10.50, image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=400', category: 'Main', rating: 4.7, calories: 480 },
      { id: 'm-4-2', name: 'Guacamole & Chips', description: 'Freshly smashed avocado, house chips', price: 8.99, image: 'https://images.unsplash.com/photo-1515003318290-3fb482c44234?auto=format&fit=crop&q=80&w=400', category: 'Sides', rating: 4.5, calories: 350 }
    ]
  }
];
