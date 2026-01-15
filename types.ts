
export type UserRole = 'user' | 'admin';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  location?: Coordinates;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  calories?: number;
  reviews?: Review[];
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisine: string[];
  menu: MenuItem[];
  reviews: Review[];
  featured?: boolean;
  location: Coordinates; // Added for map tracking
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  time: string;
  paymentMethod: 'cod' | 'paytm';
  status: 'Delivered' | 'Preparing' | 'Out for Delivery';
  deliveryLocation: Coordinates;
  restaurantLocation: Coordinates;
}

export interface AIRecommendation {
  restaurantId: string;
  menuItemId: string;
  reason: string;
}
