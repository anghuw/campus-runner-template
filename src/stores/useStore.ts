import { create } from 'zustand';
import { User, Order, Conversation, Notification, Address, Message } from '../types';
import { currentUser, orders as mockOrders, conversations as mockConversations, notifications as mockNotifications, addresses as mockAddresses } from '../data/mockData';
import { isApiMode } from '../api/client';
import * as taskApi from '../api/tasks';
import * as authApi from '../api/auth';

interface AuthState {
  token: string | null;
  authUser: { id: string; phone: string; nickname: string; studentId?: string } | null;
  isLoggedIn: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, nickname: string, password: string, studentId?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

interface AppState extends AuthState {
  user: User;
  orders: Order[];
  conversations: Conversation[];
  notifications: Notification[];
  addresses: Address[];
  messages: Record<string, Message[]>;
  activeTab: string;
  loading: boolean;
  error: string | null;

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

  // API mode
  fetchTasks: () => Promise<void>;
  createTask: (data: any) => Promise<void>;
  acceptTask: (taskId: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  token: null,
  authUser: null,
  isLoggedIn: false,
  loading: false,
  error: null,

  login: async (phone, password) => {
    if (!isApiMode()) {
      set({ isLoggedIn: true, authUser: { id: 'mock', phone, nickname: 'Mock用户' } });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await authApi.login({ phone, password });
      set({ token: res.token, authUser: res.user, isLoggedIn: true, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  register: async (phone, nickname, password, studentId) => {
    if (!isApiMode()) {
      set({ isLoggedIn: true, authUser: { id: 'mock', phone, nickname } });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await authApi.register({ phone, nickname, password, studentId });
      set({ token: res.token, authUser: res.user, isLoggedIn: true, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: () => {
    set({ token: null, authUser: null, isLoggedIn: false });
  },

  loadUser: async () => {
    const { token } = get();
    if (!token || !isApiMode()) return;
    try {
      const user = await authApi.getMe(token);
      set({ authUser: user, isLoggedIn: true });
    } catch {
      set({ token: null, authUser: null, isLoggedIn: false });
    }
  },

  // Data
  user: currentUser,
  orders: mockOrders,
  conversations: mockConversations,
  notifications: mockNotifications,
  addresses: mockAddresses,
  messages: {},
  activeTab: 'home',

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

  // API mode actions
  fetchTasks: async () => {
    if (!isApiMode()) return;
    set({ loading: true });
    try {
      const tasks = await taskApi.getTasks();
      // Map backend tasks to frontend Order type
      const orders: Order[] = tasks.map((t: any) => ({
        id: t.id,
        orderNo: t.id.slice(0, 8),
        type: t.type,
        status: t.status,
        title: t.title,
        description: t.description || '',
        pickupAddress: t.pickupLocation,
        deliveryAddress: t.deliveryLocation,
        pickupLocation: { latitude: 0, longitude: 0, address: t.pickupLocation },
        deliveryLocation: { latitude: 0, longitude: 0, address: t.deliveryLocation },
        reward: t.reward,
        tip: 0,
        distance: 0,
        estimatedTime: 0,
        items: [],
        publisherId: t.publisherId,
        publisherName: t.publisher?.nickname || '匿名',
        publisherAvatar: '',
        runnerId: t.runnerId,
        runnerName: t.runner?.nickname,
        createdAt: t.createdAt,
        expiredAt: new Date(Date.now() + 3600000).toISOString(),
        isUrgent: false,
      }));
      set({ orders, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createTask: async (data) => {
    const { token } = get();
    if (!isApiMode() || !token) return;
    set({ loading: true });
    try {
      await taskApi.createTask(data, token);
      // Refresh tasks
      await get().fetchTasks();
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  acceptTask: async (taskId) => {
    const { token } = get();
    if (!isApiMode() || !token) return;
    try {
      await taskApi.acceptTask(taskId, token);
      await get().fetchTasks();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
}));
