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
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../stores/useStore';

const MenuItem = ({ icon, label, value, onPress }: { icon: string; label: string; value?: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      <View style={styles.menuIcon}>
        <Feather name={icon as any} size={18} color="#666" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <View style={styles.menuRight}>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      <Feather name="chevron-right" size={18} color="#ccc" />
    </View>
  </TouchableOpacity>
);

export default function ProfilePage() {
  const navigation = useNavigation<any>();
  const { user, orders } = useStore();

  const myOrders = orders.filter((o) => o.publisherId === user.id);
  const completedOrders = myOrders.filter((o) => o.status === 'completed');

  const menuSections = [
    {
      title: '订单管理',
      items: [
        { icon: 'package', label: '我的订单', value: `${myOrders.length}单`, path: 'Orders' },
        { icon: 'clock', label: '待接订单', value: `${myOrders.filter((o) => o.status === 'pending').length}单`, path: 'Orders' },
        { icon: 'star', label: '我的评价', path: 'Rating' },
      ],
    },
    {
      title: '账户管理',
      items: [
        { icon: 'wallet', label: '我的钱包', value: `¥${user.balance.toFixed(2)}`, path: 'Wallet' },
        { icon: 'credit-card', label: '优惠券', value: '3张', path: 'Coupons' },
        { icon: 'map-pin', label: '收货地址', path: 'Addresses' },
      ],
    },
    {
      title: '跑腿服务',
      items: [
        { icon: 'trending-up', label: '跑腿数据', path: 'Runner' },
        { icon: 'award', label: '跑腿等级', value: `Lv.${user.runnerLevel || 1}`, path: 'Runner' },
        { icon: 'user', label: '实名认证', value: '已认证', path: 'Verify' },
      ],
    },
    {
      title: '其他',
      items: [
        { icon: 'bell', label: '消息设置', path: 'Settings' },
        { icon: 'help-circle', label: '帮助中心', path: 'Help' },
        { icon: 'info', label: '关于我们', path: 'About' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Feather name="settings" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>{user.nickname[0]}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.nickname}</Text>
              <Text style={styles.userSchool}>{user.school} · {user.studentId}</Text>
              <View style={styles.userTags}>
                <View style={styles.creditTag}>
                  <Feather name="star" size={12} color="#FFB800" />
                  <Text style={styles.creditText}>信用分 {user.credit}</Text>
                </View>
                {user.isRunner && (
                  <View style={styles.runnerTag}>
                    <Text style={styles.runnerTagText}>跑腿员 Lv.{user.runnerLevel}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.orderCount}</Text>
              <Text style={styles.statLabel}>总订单</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedOrders.length}</Text>
              <Text style={styles.statLabel}>已完成</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>¥{user.balance.toFixed(0)}</Text>
              <Text style={styles.statLabel}>余额</Text>
            </View>
          </View>
        </View>

        {/* Runner Card */}
        {user.isRunner && (
          <TouchableOpacity
            style={styles.runnerCard}
            onPress={() => navigation.navigate('Runner')}
            activeOpacity={0.7}
          >
            <View style={styles.runnerCardHeader}>
              <Text style={styles.runnerCardTitle}>跑腿中心</Text>
              <Feather name="chevron-right" size={18} color="#666" />
            </View>
            <View style={styles.runnerStats}>
              <View style={styles.runnerStatItem}>
                <Text style={styles.runnerStatNumber}>156</Text>
                <Text style={styles.runnerStatLabel}>接单数</Text>
              </View>
              <View style={styles.runnerStatItem}>
                <Text style={styles.runnerStatNumber}>4.8</Text>
                <Text style={styles.runnerStatLabel}>评分</Text>
              </View>
              <View style={styles.runnerStatItem}>
                <Text style={styles.runnerStatNumber}>95%</Text>
                <Text style={styles.runnerStatLabel}>接单率</Text>
              </View>
              <View style={styles.runnerStatItem}>
                <Text style={[styles.runnerStatNumber, { color: '#FF6B35' }]}>¥45</Text>
                <Text style={styles.runnerStatLabel}>今日收入</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <View key={index} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <MenuItem
                  key={itemIndex}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  onPress={() => item.path && navigation.navigate(item.path)}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Alert.alert('退出登录', '确定要退出登录吗？', [
            { text: '取消', style: 'cancel' },
            { text: '确认', style: 'destructive' },
          ])}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  settingsButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  userSchool: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  userTags: {
    flexDirection: 'row',
    gap: 8,
  },
  creditTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditText: {
    fontSize: 12,
    color: '#fff',
  },
  runnerTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  runnerTagText: {
    fontSize: 12,
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
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
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  runnerCard: {
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
  runnerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  runnerCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  runnerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  runnerStatItem: {
    alignItems: 'center',
  },
  runnerStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  runnerStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  menuSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    color: '#333',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});