export interface User {
  id: string;
  nickname: string;
  avatar: string;
  phone: string;
  school: string;
  studentId: string;
  balance: number;
  credit: number;
  orderCount: number;
  isRunner: boolean;
  runnerLevel?: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNo: string;
  type: OrderType;
  status: OrderStatus;
  title: string;
  description: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  reward: number;
  tip: number;
  distance: number;
  estimatedTime: number;
  items: OrderItem[];
  publisherId: string;
  publisherName: string;
  publisherAvatar: string;
  runnerId?: string;
  runnerName?: string;
  runnerAvatar?: string;
  runnerPhone?: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  expiredAt: string;
  remark?: string;
  images?: string[];
  isUrgent: boolean;
  rating?: number;
  review?: string;
}

export type OrderType = 'delivery' | 'takeout' | 'shopping' | 'print' | 'express' | 'other';

export type OrderStatus = 'pending' | 'accepted' | 'picking' | 'delivering' | 'completed' | 'cancelled' | 'expired';

export interface OrderItem {
  name: string;
  quantity: number;
  remark?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  detail?: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'location' | 'system';
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  orderId: string;
  orderTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'system' | 'promotion';
  title: string;
  content: string;
  orderId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  detail: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  tag?: string;
}

export interface RunnerStats {
  totalOrders: number;
  completedOrders: number;
  totalEarnings: number;
  todayEarnings: number;
  rating: number;
  acceptanceRate: number;
  onTimeRate: number;
  cancelRate: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}