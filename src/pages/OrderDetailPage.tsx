import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { formatTime, formatDistance, formatPrice, getStatusLabel, getOrderTypeLabel } from '../utils';

export default function OrderDetailPage() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId } = route.params;
  const { orders, user, acceptOrder, updateOrderStatus } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>订单不存在</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isPublisher = order.publisherId === user.id;
  const isRunner = order.runnerId === user.id;
  const canAccept = order.status === 'pending' && !isPublisher;
  const canComplete = isRunner && ['accepted', 'picking', 'delivering'].includes(order.status);
  const canCancel = (isPublisher || isRunner) && ['pending', 'accepted'].includes(order.status);

  const handleAccept = () => {
    acceptOrder(order.id, user.id, user.nickname);
    setShowConfirm(false);
    Alert.alert('接单成功', '请及时完成配送');
  };

  const handleComplete = () => {
    Alert.alert('确认送达', '确认已完成配送？', [
      { text: '取消', style: 'cancel' },
      { text: '确认', onPress: () => updateOrderStatus(order.id, 'completed') },
    ]);
  };

  const handleCancel = () => {
    Alert.alert('取消订单', '确定要取消订单吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确认', onPress: () => updateOrderStatus(order.id, 'cancelled'), style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>订单详情</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusInfo}>
            <View style={styles.orderTypeIcon}>
              <Feather name="package" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.orderTitle}>{order.title}</Text>
              <Text style={styles.orderNo}>{order.orderNo}</Text>
            </View>
          </View>
          <View style={styles.statusBadges}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{getStatusLabel(order.status)}</Text>
            </View>
            {order.isUrgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>加急订单</Text>
              </View>
            )}
          </View>
        </View>

        {/* Route Card */}
        <View style={styles.card}>
          <View style={styles.routeContainer}>
            <View style={styles.routeLine}>
              <View style={styles.routeDot} />
              <View style={styles.routeDash} />
              <View style={[styles.routeDot, { backgroundColor: '#FF3B30' }]} />
            </View>
            <View style={styles.routeDetails}>
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>取件地址</Text>
                <Text style={styles.routeAddress}>{order.pickupAddress}</Text>
              </View>
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>送达地址</Text>
                <Text style={styles.routeAddress}>{order.deliveryAddress}</Text>
              </View>
            </View>
          </View>
          <View style={styles.routeFooter}>
            <View style={styles.routeInfo}>
              <View style={styles.infoItem}>
                <Feather name="map-pin" size={14} color="#999" />
                <Text style={styles.infoText}>{formatDistance(order.distance)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Feather name="clock" size={14} color="#999" />
                <Text style={styles.infoText}>约{order.estimatedTime}分钟</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.navButton}>
              <Feather name="navigation" size={14} color="#FF6B35" />
              <Text style={styles.navButtonText}>导航</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>订单信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>服务类型</Text>
            <Text style={styles.infoValue}>{getOrderTypeLabel(order.type)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>订单描述</Text>
            <Text style={styles.infoValue}>{order.description}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>物品列表</Text>
            <Text style={styles.infoValue}>
              {order.items.map((item) => `${item.name}×${item.quantity}`).join('、')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>发布时间</Text>
            <Text style={styles.infoValue}>{formatTime(order.createdAt)}</Text>
          </View>
          {order.acceptedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>接单时间</Text>
              <Text style={styles.infoValue}>{formatTime(order.acceptedAt)}</Text>
            </View>
          )}
          {order.completedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>完成时间</Text>
              <Text style={styles.infoValue}>{formatTime(order.completedAt)}</Text>
            </View>
          )}
          {order.remark && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>备注</Text>
              <Text style={styles.infoValue}>{order.remark}</Text>
            </View>
          )}
        </View>

        {/* Reward Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>赏金信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>基础报酬</Text>
            <Text style={styles.infoValue}>¥{formatPrice(order.reward)}</Text>
          </View>
          {order.tip > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>小费</Text>
              <Text style={[styles.infoValue, { color: '#FF6B35' }]}>+¥{formatPrice(order.tip)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.totalLabel}>总计</Text>
            <Text style={styles.totalPrice}>¥{formatPrice(order.reward + order.tip)}</Text>
          </View>
        </View>

        {/* Runner Info */}
        {order.runnerId && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {isPublisher ? '跑腿员信息' : '订单发布者'}
            </Text>
            <View style={styles.runnerContainer}>
              <View style={styles.runnerInfo}>
                <View style={styles.runnerAvatar}>
                  <Text style={styles.runnerAvatarText}>
                    {isPublisher ? order.runnerName?.[0] : order.publisherName[0]}
                  </Text>
                </View>
                <View>
                  <Text style={styles.runnerName}>
                    {isPublisher ? order.runnerName : order.publisherName}
                  </Text>
                  <View style={styles.runnerStats}>
                    <Feather name="star" size={12} color="#FFB800" />
                    <Text style={styles.runnerRating}>4.8</Text>
                    <Text style={styles.runnerDivider}>·</Text>
                    <Text style={styles.runnerOrders}>已完成128单</Text>
                  </View>
                </View>
              </View>
              <View style={styles.runnerActions}>
                <TouchableOpacity style={styles.phoneButton}>
                  <Feather name="phone" size={18} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => navigation.navigate('Chat', { orderId: order.id })}
                >
                  <Feather name="message-square" size={18} color="#FF6B35" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Rating */}
        {order.rating && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>评价</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Feather
                  key={star}
                  name="star"
                  size={20}
                  color={star <= order.rating! ? '#FFB800' : '#e0e0e0'}
                  style={star <= order.rating! ? { backgroundColor: '#FFB800' } : {}}
                />
              ))}
            </View>
            {order.review && <Text style={styles.reviewText}>{order.review}</Text>}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        {canAccept && (
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => setShowConfirm(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptBtnText}>立即接单</Text>
          </TouchableOpacity>
        )}
        {canComplete && (
          <>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => navigation.navigate('Chat', { orderId: order.id })}
            >
              <Text style={styles.contactBtnText}>联系对方</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={handleComplete}>
              <Text style={styles.acceptBtnText}>确认送达</Text>
            </TouchableOpacity>
          </>
        )}
        {canCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>取消订单</Text>
          </TouchableOpacity>
        )}
        {order.status === 'completed' && isPublisher && !order.rating && (
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => navigation.navigate('Rating', { orderId: order.id })}
          >
            <Text style={styles.acceptBtnText}>去评价</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Confirm Modal */}
      {showConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>确认接单</Text>
            <Text style={styles.modalText}>接单后请在规定时间内完成配送，确认接单？</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.modalCancelBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleAccept}
              >
                <Text style={styles.modalConfirmBtnText}>确认接单</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  shareButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#FF6B35',
  },
  statusBanner: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  orderTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  orderNo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  statusBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  urgentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,59,48,0.3)',
    borderRadius: 16,
  },
  urgentBadgeText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  routeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  routeLine: {
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  routeDash: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
    gap: 16,
  },
  routeItem: {
    gap: 4,
  },
  routeLabel: {
    fontSize: 13,
    color: '#999',
  },
  routeAddress: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  routeInfo: {
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
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navButtonText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  runnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  runnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  runnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B3515',
    justifyContent: 'center',
    alignItems: 'center',
  },
  runnerAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
  },
  runnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  runnerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  runnerRating: {
    fontSize: 13,
    color: '#666',
  },
  runnerDivider: {
    fontSize: 13,
    color: '#999',
  },
  runnerOrders: {
    fontSize: 13,
    color: '#666',
  },
  runnerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  phoneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B3515',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  acceptBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#FF6B35',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  contactBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 16,
    color: '#666',
  },
  modalConfirmBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#FF6B35',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});