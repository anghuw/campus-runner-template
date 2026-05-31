import { format, formatDistanceToNow, parseISO, isToday, isYesterday } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatTime = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    }
    if (isYesterday(date)) {
      return '昨天 ' + format(date, 'HH:mm');
    }
    return format(date, 'MM-dd HH:mm');
  } catch {
    return dateStr;
  }
};

export const formatRelativeTime = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
  } catch {
    return dateStr;
  }
};

export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const generateOrderNo = (): string => {
  const now = new Date();
  const date = format(now, 'yyyyMMdd');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CP${date}${random}`;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#FF9800',
    accepted: '#2196F3',
    picking: '#9C27B0',
    delivering: '#FF6B35',
    completed: '#4CAF50',
    cancelled: '#9E9E9E',
    expired: '#F44336',
  };
  return colors[status] || '#666';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: '待接单',
    accepted: '已接单',
    picking: '取件中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消',
    expired: '已过期',
  };
  return labels[status] || status;
};

export const getOrderTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    express: '代取快递',
    takeout: '代买餐食',
    shopping: '代买物品',
    print: '代打印',
    delivery: '代送文件',
    other: '其他',
  };
  return labels[type] || type;
};

export const getOrderTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    express: 'package',
    takeout: 'utensils',
    shopping: 'shopping-bag',
    print: 'printer',
    delivery: 'file-text',
    other: 'more-horizontal',
  };
  return icons[type] || 'help-circle';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};