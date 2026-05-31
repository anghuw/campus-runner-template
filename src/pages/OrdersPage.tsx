import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { formatDistance, formatPrice, getStatusColor, getStatusLabel, getOrderTypeLabel } from '../utils';

const statusTabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待接单' },
  { id: 'accepted', label: '进行中' },
  { id: 'completed', label: '已完成' },
];

const typeFilters = [
  { id: 'all', label: '全部' },
  { id: 'express', label: '代取快递' },
  { id: 'takeout', label: '代买餐食' },
  { id: 'shopping', label: '代买物品' },
  { id: 'print', label: '代打印' },
  { id: 'delivery', label: '代送文件' },
];

const OrderCard = ({ order, onPress, onAccept }: { order: any; onPress: () => void; onAccept?: () => void }) => (
  <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.orderHeader}>
      <View style={styles.orderTypeContainer}>
        <View style={[styles.orderTypeIcon, { backgroundColor: '#FF6B3515' }]}>
          <Feather name="package" size={16} color="#FF6B35" />
        </View>
        <Text style={styles.orderType}>{getOrderTypeLabel(order.type)}</Text>
        {order.isUrgent && (
          <View style={styles.urgentBadge}>
            <Feather name="zap" size={10} color="#FF3B30" />
            <Text style={styles.urgentText}>加急</Text>
          </View>
        )}
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
        <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
          {getStatusLabel(order.status)}
        </Text>
      </View>
    </View>

    <Text style={styles.orderTitle}>{order.title}</Text>
    <Text style={styles.orderDesc} numberOfLines={2}>{order.description}</Text>

    <View style={styles.orderRoute}>
      <View style={styles.routeDot} />
      <Text style={styles.routeText} numberOfLines={1}>{order.pickupAddress}</Text>
      <Feather name="arrow-right" size={14} color="#999" style={{ marginHorizontal: 8 }} />
      <View style={[styles.routeDot, { backgroundColor: '#FF3B30' }]} />
      <Text style={styles.routeText} numberOfLines={1}>{order.deliveryAddress}</Text>
    </View>

    <View style={styles.orderFooter}>
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
      <Text style={styles.orderPrice}>¥{formatPrice(order.reward + order.tip)}</Text>
    </View>

    <View style={styles.orderBottom}>
      <View style={styles.publisherInfo}>
        <View style={styles.publisherAvatar}>
          <Text style={styles.avatarText}>{order.publisherName[0]}</Text>
        </View>
        <Text style={styles.publisherName}>{order.publisherName}</Text>
      </View>
      {onAccept && order.status === 'pending' && (
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={onAccept}
          activeOpacity={0.7}
        >
          <Text style={styles.acceptButtonText}>接单</Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
);

export default function OrdersPage() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orders, user, acceptOrder } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [activeType, setActiveType] = useState(route.params?.type || 'all');

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      activeTab === 'all' ||
      (activeTab === 'pending' && order.status === 'pending') ||
      (activeTab === 'accepted' && ['accepted', 'picking', 'delivering'].includes(order.status)) ||
      (activeTab === 'completed' && order.status === 'completed');

    const typeMatch = activeType === 'all' || order.type === activeType;

    return statusMatch && typeMatch;
  });

  const handleAccept = (orderId: string) => {
    acceptOrder(orderId, user.id, user.nickname);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>订单大厅</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
          style={styles.searchButton}
        >
          <Feather name="search" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabContainer}>
        {statusTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {typeFilters.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.filterChip, activeType === type.id && styles.activeFilterChip]}
            onPress={() => setActiveType(type.id)}
          >
            <Text style={[styles.filterText, activeType === type.id && styles.activeFilterText]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            onAccept={activeTab === 'pending' ? () => handleAccept(item.id) : undefined}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Feather name="clipboard" size={48} color="#ccc" />
            </View>
            <Text style={styles.emptyText}>暂无订单</Text>
            <Text style={styles.emptySubtext}>换个筛选条件试试</Text>
          </View>
        }
      />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchButton: {
    padding: 4,
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
    paddingVertical: 14,
    alignItems: 'center',
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
  filterContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  activeFilterChip: {
    backgroundColor: '#FF6B35',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  listContent: {
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
  orderTypeIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderType: {
    fontSize: 14,
    color: '#666',
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderInfo: {
    flexDirection: 'row',
    gap: 16,
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
  orderPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
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
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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
});