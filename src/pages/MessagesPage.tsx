import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { formatTime } from '../utils';

const tabs = [
  { id: 'chat', label: '聊天' },
  { id: 'notification', label: '通知' },
];

const ChatItem = ({ item, onPress }: { item: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.avatarContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.otherUserName[0]}</Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </View>
    <View style={styles.chatContent}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatName}>{item.otherUserName}</Text>
        <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
      </View>
      <Text style={styles.chatMessage} numberOfLines={1}>
        [{item.orderTitle}] {item.lastMessage}
      </Text>
    </View>
  </TouchableOpacity>
);

const NotificationItem = ({ item, onPress }: { item: any; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.notifItem, !item.isRead && styles.unreadNotif]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.notifIcon, { backgroundColor: getNotifColor(item.type) + '15' }]}>
      <Feather
        name={getNotifIcon(item.type)}
        size={20}
        color={getNotifColor(item.type)}
      />
    </View>
    <View style={styles.notifContent}>
      <View style={styles.notifHeader}>
        <Text style={styles.notifTitle}>{item.title}</Text>
        {!item.isRead && <View style={styles.redDot} />}
      </View>
      <Text style={styles.notifText}>{item.content}</Text>
      <Text style={styles.notifTime}>{formatTime(item.createdAt)}</Text>
    </View>
  </TouchableOpacity>
);

const getNotifIcon = (type: string) => {
  switch (type) {
    case 'order': return 'clipboard';
    case 'promotion': return 'gift';
    default: return 'info';
  }
};

const getNotifColor = (type: string) => {
  switch (type) {
    case 'order': return '#2196F3';
    case 'promotion': return '#FF6B35';
    default: return '#666';
  }
};

export default function MessagesPage() {
  const navigation = useNavigation<any>();
  const { conversations, notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [activeTab, setActiveTab] = useState('chat');

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>消息</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <View style={styles.tabContent}>
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
              {tab.id === 'notification' && unreadNotifCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{unreadNotifCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'chat' ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.orderId}
          renderItem={({ item }) => (
            <ChatItem
              item={item}
              onPress={() => navigation.navigate('Chat', { orderId: item.orderId })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Feather name="message-square" size={48} color="#ccc" />
              </View>
              <Text style={styles.emptyText}>暂无聊天消息</Text>
              <Text style={styles.emptySubtext}>接单后即可与对方沟通</Text>
            </View>
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          {unreadNotifCount > 0 && (
            <TouchableOpacity
              style={styles.markAllRead}
              onPress={markAllNotificationsRead}
            >
              <Text style={styles.markAllReadText}>全部已读</Text>
            </TouchableOpacity>
          )}
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationItem
                item={item}
                onPress={() => {
                  markNotificationRead(item.id);
                  if (item.orderId) {
                    navigation.navigate('OrderDetail', { orderId: item.orderId });
                  }
                }}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    backgroundColor: '#FF3B30',
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
  listContent: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B3515',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
  },
  markAllRead: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  markAllReadText: {
    fontSize: 14,
    color: '#FF6B35',
  },
  notifItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadNotif: {
    backgroundColor: '#FF6B3508',
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  notifText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 12,
    color: '#999',
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