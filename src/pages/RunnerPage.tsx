import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { runnerStats } from '../data/mockData';
import { formatDistance, formatPrice, getStatusLabel, getOrderTypeLabel } from '../utils';

const tabs = [
  { id: 'available', label: '可抢订单' },
  { id: 'my', label: '我的订单' },
];

const AvailableOrderCard = ({ order, onAccept }: { order: any; onAccept: () => void }) => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <View style={styles.orderTypeContainer}>
        {order.isUrgent && (
          <View style={styles.urgentBadge}>
            <Feather name="zap" size={10} color="#FF3B30" />
            <Text style={styles.urgentText}>加急</Text>
          </View>
        )}
        <Text style={styles.orderType}>{getOrderTypeLabel(order.type)}</Text>
      </View>
      <Text style={styles.orderPrice}>¥{formatPrice(order.reward + order.tip)}</Text>
    </View>

    <Text style={styles.orderTitle}>{order.title}</Text>
    <Text style={styles.orderDesc} numberOfLines={2}>{order.description}</Text>

    <View style={styles.orderInfo}>
      <View style={styles.infoItem}>
        <Feather name="map-pin" size={14} color="#999" />
        <Text style={styles.infoText}>{formatDistance(order.distance)}</Text>
      </View>
      <View style={styles.infoItem}>
        <Feather name="clock" size={14} color="#999" />
        <Text style={styles.infoText}>约{order.estimatedTime}分钟</Text>
      </View>
    </View>

    <View style={styles.orderFooter}>
      <View style={styles.publisherInfo}>
        <View style={styles.publisherAvatar}>
          <Text style={styles.avatarText}>{order.publisherName[0]}</Text>
        </View>
        <Text style={styles.publisherName}>{order.publisherName}</Text>
      </View>
      <TouchableOpacity style={styles.acceptButton} onPress={onAccept} activeOpacity={0.7}>
        <Text style={styles.acceptButtonText}>抢单</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MyOrderCard = ({ order, onPress, onChat }: { order: any; onPress: () => void; onChat: () => void }) => (
  <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.orderHeader}>
      <Text style={styles.orderTitle}>{order.title}</Text>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
        <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
          {getStatusLabel(order.status)}
        </Text>
      </View>
    </View>

    <View style={styles.orderRoute}>
      <View style={styles.routeDot} />
      <Text style={styles.routeText} numberOfLines={1}>{order.pickupAddress}</Text>
      <Feather name="arrow-right" size={14} color="#999" style={{ marginHorizontal: 8 }} />
      <View style={[styles.routeDot, { backgroundColor: '#FF3B30' }]} />
      <Text style={styles.routeText} numberOfLines={1}>{order.deliveryAddress}</Text>
    </View>

    <View style={styles.orderFooter}>
      <Text style={styles.orderPrice}>¥{formatPrice(order.reward + order.tip)}</Text>
      <TouchableOpacity style={styles.chatButton} onPress={onChat} activeOpacity={0.7}>
        <Text style={styles.chatButtonText}>联系对方</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    accepted: '#2196F3',
    picking: '#9C27B0',
    delivering: '#FF6B35',
    completed: '#4CAF50',
  };
  return colors[status] || '#666';
};

export default function RunnerPage() {
  const navigation = useNavigation<any>();
  const { orders, user, acceptOrder } = useStore();
  const [activeTab, setActiveTab] = useState('available');

  const availableOrders = orders.filter((o) => o.status === 'pending');
  const myOrders = orders.filter((o) => o.runnerId === user.id && o.status !== 'completed');

  const handleAccept = (orderId: string) => {
    Alert.alert('确认抢单', '确定要接下这个订单吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        onPress: () => {
          acceptOrder(orderId, user.id, user.nickname);
          Alert.alert('抢单成功', '请及时完成配送');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>跑腿中心</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Runner Stats */}
        <View style={styles.statsCard}>
          <View style={styles.runnerInfo}>
            <View style={styles.runnerAvatar}>
              <Text style={styles.runnerAvatarText}>{user.nickname[0]}</Text>
            </View>
            <View>
              <Text style={styles.runnerName}>{user.nickname}</Text>
              <View style={styles.runnerTags}>
                <Feather name="star" size={14} color="#FFB800" />
                <Text style={styles.runnerRating}>{runnerStats.rating}分</Text>
                <Text style={styles.runnerDivider}>·</Text>
                <Text style={styles.runnerLevel}>Lv.{user.runnerLevel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>¥{runnerStats.todayEarnings.toFixed(0)}</Text>
              <Text style={styles.statLabel}>今日收入</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{runnerStats.totalOrders}</Text>
              <Text style={styles.statLabel}>总接单</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{runnerStats.acceptanceRate}%</Text>
              <Text style={styles.statLabel}>接单率</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{runnerStats.onTimeRate}%</Text>
              <Text style={styles.statLabel}>准时率</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
              {tab.id === 'available' && availableOrders.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{availableOrders.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order List */}
        <View style={styles.orderList}>
          {activeTab === 'available' ? (
            availableOrders.length > 0 ? (
              availableOrders.map((order) => (
                <AvailableOrderCard
                  key={order.id}
                  order={order}
                  onAccept={() => handleAccept(order.id)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <Feather name="package" size={48} color="#ccc" />
                </View>
                <Text style={styles.emptyText}>暂无可抢订单</Text>
                <Text style={styles.emptySubtext}>稍后再来看看</Text>
              </View>
            )
          ) : (
            myOrders.length > 0 ? (
              myOrders.map((order) => (
                <MyOrderCard
                  key={order.id}
                  order={order}
                  onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                  onChat={() => navigation.navigate('Chat', { orderId: order.id })}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <Feather name="check-circle" size={48} color="#ccc" />
                </View>
                <Text style={styles.emptyText}>暂无进行中的订单</Text>
                <Text style={styles.emptySubtext}>去可抢订单看看吧</Text>
              </View>
            )
          )}
        </View>

        {/* Today Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>今日数据</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: '#4CAF5015' }]}>
                <Feather name="dollar-sign" size={18} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.summaryNumber}>¥{runnerStats.todayEarnings.toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>今日收入</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: '#2196F315' }]}>
                <Feather name="trending-up" size={18} color="#2196F3" />
              </View>
              <View>
                <Text style={styles.summaryNumber}>¥{runnerStats.totalEarnings.toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>总收入</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FF6B35',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  runnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  runnerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  runnerAvatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  runnerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  runnerTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  runnerRating: {
    fontSize: 14,
    color: '#fff',
  },
  runnerDivider: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  runnerLevel: {
    fontSize: 14,
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 15,
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  orderList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B3015',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  urgentText: {
    fontSize: 10,
    color: '#FF3B30',
    fontWeight: '600',
  },
  orderType: {
    fontSize: 14,
    color: '#666',
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#999',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  publisherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  publisherAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  publisherName: {
    fontSize: 13,
    color: '#666',
  },
  acceptButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  routeText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  chatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 20,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
});