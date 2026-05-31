import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { Message } from '../types';
import { formatTime } from '../utils';

const MessageBubble = ({ message, isMe }: { message: Message; isMe: boolean }) => (
  <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
    {!isMe && (
      <View style={styles.messageAvatar}>
        <Text style={styles.messageAvatarText}>{message.senderName[0]}</Text>
      </View>
    )}
    <View style={[styles.messageBubble, isMe && styles.messageBubbleMe]}>
      {message.type === 'text' && (
        <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
          {message.content}
        </Text>
      )}
    </View>
    <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>
      {formatTime(message.createdAt)}
    </Text>
  </View>
);

export default function ChatPage() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId } = route.params;
  const { orders, user, messages, addMessage } = useStore();
  const [inputText, setInputText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const order = orders.find((o) => o.id === orderId);
  const chatMessages = messages[orderId] || [];

  const otherUser = order?.publisherId === user.id
    ? { name: order.runnerName || '跑腿员' }
    : { name: order?.publisherName || '发布者' };

  const handleSend = () => {
    if (!inputText.trim() || !orderId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      orderId,
      senderId: user.id,
      senderName: user.nickname,
      senderAvatar: user.avatar,
      content: inputText.trim(),
      type: 'text',
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    addMessage(orderId, newMessage);
    setInputText('');
  };

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{otherUser.name}</Text>
          <Text style={styles.headerSubtitle}>{order.title}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Order Info Banner */}
      <TouchableOpacity
        style={styles.orderBanner}
        onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.orderBannerTitle}>{order.title}</Text>
          <Text style={styles.orderBannerNo}>{order.orderNo}</Text>
        </View>
        <Feather name="chevron-right" size={18} color="#666" />
      </TouchableOpacity>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} isMe={item.senderId === user.id} />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListHeaderComponent={
            <View style={styles.systemMessage}>
              <Text style={styles.systemMessageText}>订单已创建，请及时沟通确认详情</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>暂无消息</Text>
            </View>
          }
        />

        {/* Quick Actions */}
        {showActions && (
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#2196F315' }]}>
                <Feather name="image" size={20} color="#2196F3" />
              </View>
              <Text style={styles.quickActionText}>图片</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF5015' }]}>
                <Feather name="map-pin" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>位置</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF6B3515' }]}>
                <Feather name="phone" size={20} color="#FF6B35" />
              </View>
              <Text style={styles.quickActionText}>电话</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowActions(!showActions)}
          >
            <Feather name={showActions ? 'x' : 'plus'} size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="输入消息..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={20} color={inputText.trim() ? '#FF6B35' : '#ccc'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  orderBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6B3508',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  orderBannerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  orderBannerNo: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  systemMessage: {
    alignItems: 'center',
    marginBottom: 16,
  },
  systemMessageText: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowMe: {
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F315',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  messageBubble: {
    maxWidth: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  messageBubbleMe: {
    backgroundColor: '#FF6B35',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginLeft: 8,
    marginBottom: 4,
  },
  messageTimeMe: {
    marginLeft: 0,
    marginRight: 8,
  },
  emptyChat: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChatText: {
    fontSize: 14,
    color: '#999',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickAction: {
    alignItems: 'center',
    gap: 6,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    color: '#333',
    marginHorizontal: 8,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonActive: {
    backgroundColor: '#FF6B3515',
    borderRadius: 20,
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
});