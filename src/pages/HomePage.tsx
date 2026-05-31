import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { serviceCategories } from '../data/mockData';
import { isApiMode } from '../api/client';
import { formatDistance, formatPrice, getStatusColor, getStatusLabel, getOrderTypeLabel } from '../utils';

const { width } = Dimensions.get('window');

const ServiceCard = ({ item, onPress }: { item: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.serviceCard} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.serviceIcon, { backgroundColor: item.color + '15' }]}>
      <Feather name={item.icon as any} size={24} color={item.color} />
    </View>
    <Text style={styles.serviceName}>{item.name}</Text>
  </TouchableOpacity>
);

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

export default function HomePage() {
  const navigation = useNavigation<any>();
  const { orders, user, acceptOrder, fetchTasks, isLoggedIn } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // Fetch from API on mount if in API mode
  React.useEffect(() => {
    if (isApiMode()) {
      fetchTasks();
    }
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const nearbyOrders = pendingOrders.slice(0, 3);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (isApiMode()) {
      await fetchTasks();
    }
    setRefreshing(false);
  }, []);

  const handleAccept = (orderId: string) => {
    acceptOrder(orderId, user.id, user.nickname);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B35']} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.locationButton}>
              <Feather name="map-pin" size={16} color="#FF6B35" />
              <Text style={styles.locationText}>{user.school}</Text>
              <Feather name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Search')}
            >
              <Feather name="search" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => {
                if (!isLoggedIn) {
                  navigation.navigate('Login');
                }
              }}
            >
              <Feather name={isLoggedIn ? 'user' : 'log-in'} size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>校园跑腿</Text>
              <Text style={styles.bannerSubtitle}>代取快递 · 代买餐食 · 代送文件</Text>
              <View style={styles.bannerButtons}>
                <TouchableOpacity
                  style={styles.bannerButton}
                  onPress={() => navigation.navigate('Publish')}
                >
                  <Text style={styles.bannerButtonText}>发布需求</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bannerButton, styles.bannerButtonOutline]}
                  onPress={() => navigation.navigate('Runner')}
                >
                  <Text style={[styles.bannerButtonText, styles.bannerButtonOutlineText]}>
                    成为跑腿
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bannerDecoration}>
              <View style={styles.bannerCircle} />
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.7}
        >
          <Feather name="search" size={18} color="#999" />
          <Text style={styles.searchPlaceholder}>搜索跑腿服务、快递代取...</Text>
        </TouchableOpacity>

        {/* Service Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>服务分类</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreText}>更多</Text>
              <Feather name="chevron-right" size={14} color="#999" />
            </TouchableOpacity>
          </View>
          <View style={styles.serviceGrid}>
            {serviceCategories.map((category) => (
              <ServiceCard
                key={category.id}
                item={category}
                onPress={() => navigation.navigate('Orders', { type: category.id })}
              />
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#2196F315' }]}>
              <Feather name="trending-up" size={20} color="#2196F3" />
            </View>
            <Text style={styles.statNumber}>{pendingOrders.length}</Text>
            <Text style={styles.statLabel}>待接订单</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#4CAF5015' }]}>
              <Feather name="clock" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>平均送达</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFB80015' }]}>
              <Feather name="star" size={20} color="#FFB800" />
            </View>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>服务评分</Text>
          </View>
        </View>

        {/* Nearby Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>附近订单</Text>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={[styles.moreText, { color: '#FF6B35' }]}>查看全部</Text>
              <Feather name="chevron-right" size={14} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          {nearbyOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
              onAccept={() => handleAccept(order.id)}
            />
          ))}
        </View>

        {/* Hot Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>热门服务</Text>
          <View style={styles.hotServices}>
            <TouchableOpacity
              style={[styles.hotCard, { backgroundColor: '#2196F3' }]}
              onPress={() => navigation.navigate('Orders', { type: 'express' })}
              activeOpacity={0.8}
            >
              <Feather name="zap" size={24} color="#fff" />
              <Text style={styles.hotTitle}>快递代取</Text>
              <Text style={styles.hotDesc}>最快15分钟送达</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.hotCard, { backgroundColor: '#4CAF50' }]}
              onPress={() => navigation.navigate('Orders', { type: 'takeout' })}
              activeOpacity={0.8}
            >
              <Feather name="clock" size={24} color="#fff" />
              <Text style={styles.hotTitle}>餐食代买</Text>
              <Text style={styles.hotDesc}>食堂美食送到寝</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  banner: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  bannerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  bannerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  bannerButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  bannerButtonOutlineText: {
    color: '#fff',
  },
  bannerDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  bannerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  moreText: {
    fontSize: 14,
    color: '#999',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceCard: {
    width: (width - 64) / 5,
    alignItems: 'center',
    paddingVertical: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  orderCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
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
  hotServices: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  hotCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
  },
  hotTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  hotDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});