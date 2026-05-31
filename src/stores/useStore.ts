import { create } from 'zustand';
import { User, Order, Conversation, Notification, Address, Message } from '../types';
import { currentUser, orders as mockOrders, conversations as mockConversations, notifications as mockNotifications, addresses as mockAddresses } from '../data/mockData';

interface AppState {
  user: User;
  orders: Order[];
  conversations: Conversation[];
  notifications: Notification[];
  addresses: Address[];
  messages: Record<string, Message[]>;
  activeTab: string;
  isLoggedIn: boolean;

  setActiveTab: (tab: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  acceptOrder: (orderId: string, runnerId: string, runnerName: string) => void;
  addOrder: (order: Order) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addMessage: (orderId: string, message: Message) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: currentUser,
  orders: mockOrders,
  conversations: mockConversations,
  notifications: mockNotifications,
  addresses: mockAddresses,
  messages: {},
  activeTab: 'home',
  isLoggedIn: true,

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    })),

  acceptOrder: (orderId, runnerId, runnerName) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'accepted',
              runnerId,
              runnerName,
              runnerAvatar: '',
              runnerPhone: '13800138001',
              acceptedAt: new Date().toISOString(),
            }
          : order
      ),
    })),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, isRead: true })),
    })),

  addMessage: (orderId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [orderId]: [...(state.messages[orderId] || []), message],
      },
    })),

  addAddress: (address) =>
    set((state) => ({
      addresses: [...state.addresses, address],
    })),

  updateAddress: (address) =>
    set((state) => ({
      addresses: state.addresses.map((a) =>
        a.id === address.id ? address : a
      ),
    })),

  deleteAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.filter((a) => a.id !== id),
    })),

  setDefaultAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    })),
}));