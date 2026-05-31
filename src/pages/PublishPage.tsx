import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { generateOrderNo } from '../utils';
import { isApiMode } from '../api/client';

const orderTypes = [
  { id: 'express', name: '代取快递', icon: 'package', color: '#FF6B35' },
  { id: 'takeout', name: '代买餐食', icon: 'coffee', color: '#FFB800' },
  { id: 'shopping', name: '代买物品', icon: 'shopping-bag', color: '#00C853' },
  { id: 'print', name: '代打印', icon: 'printer', color: '#2196F3' },
  { id: 'delivery', name: '代送文件', icon: 'file-text', color: '#9C27B0' },
  { id: 'other', name: '其他', icon: 'more-horizontal', color: '#607D8B' },
];

const quickRewards = [5, 8, 10, 15, 20];

export default function PublishPage() {
  const navigation = useNavigation<any>();
  const { addOrder, user, addresses, createTask, isLoggedIn, token } = useStore();
  const [selectedType, setSelectedType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [reward, setReward] = useState('');
  const [tip, setTip] = useState('0');
  const [isUrgent, setIsUrgent] = useState(false);
  const [remark, setRemark] = useState('');

  const defaultAddress = addresses.find((a) => a.isDefault);

  const handleSubmit = async () => {
    if (!selectedType || !title || !pickupAddress || !deliveryAddress || !reward) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    // API mode: send to backend
    if (isApiMode()) {
      if (!isLoggedIn || !token) {
        Alert.alert('提示', '请先登录', [
          { text: '去登录', onPress: () => navigation.navigate('Login') },
          { text: '取消' },
        ]);
        return;
      }
      try {
        await createTask({
          title,
          description,
          type: selectedType,
          pickupLocation: pickupAddress,
          deliveryLocation: deliveryAddress,
          reward: Number(reward),
          contactInfo: user.phone || '13800000000',
        });
        Alert.alert('发布成功', '您的跑腿需求已发布', [
          { text: '查看订单', onPress: () => navigation.navigate('Orders') },
          { text: '返回首页', onPress: () => navigation.navigate('Home') },
        ]);
      } catch (err: any) {
        Alert.alert('发布失败', err.message || '请重试');
      }
      return;
    }

    // Mock mode
    const newOrder = {
      id: `order_${Date.now()}`,
      orderNo: generateOrderNo(),
      type: selectedType as any,
      status: 'pending' as const,
      title,
      description,
      pickupAddress,
      deliveryAddress,
      pickupLocation: { latitude: 40.000, longitude: 116.326, address: pickupAddress },
      deliveryLocation: { latitude: 39.999, longitude: 116.325, address: deliveryAddress },
      reward: Number(reward),
      tip: Number(tip),
      distance: Math.random() * 2 + 0.5,
      estimatedTime: Math.floor(Math.random() * 20 + 10),
      items: [{ name: title, quantity: 1, remark }],
      publisherId: user.id,
      publisherName: user.nickname,
      publisherAvatar: user.avatar,
      createdAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      isUrgent,
    };

    addOrder(newOrder);
    Alert.alert('发布成功', '您的跑腿需求已发布，请等待跑腿员接单', [
      { text: '查看订单', onPress: () => navigation.navigate('Orders') },
      { text: '返回首页', onPress: () => navigation.navigate('Home') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>发布需求</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择服务类型</Text>
          <View style={styles.typeGrid}>
            {orderTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.selectedTypeCard,
                ]}
                onPress={() => setSelectedType(type.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.typeIcon, { backgroundColor: type.color + '15' }]}>
                  <Feather name={type.icon as any} size={24} color={type.color} />
                </View>
                <Text
                  style={[
                    styles.typeName,
                    selectedType === type.id && styles.selectedTypeName,
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              标题 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="例如：代取韵达快递"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>详细描述</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="描述一下您的需求，让跑腿员更清楚..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              取件地址 <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.addressInput}>
              <Feather name="map-pin" size={18} color="#999" />
              <TextInput
                style={styles.addressTextInput}
                value={pickupAddress}
                onChangeText={setPickupAddress}
                placeholder="输入取件地址"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              送达地址 <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.addressInput}>
              <Feather name="map-pin" size={18} color="#999" />
              <TextInput
                style={styles.addressTextInput}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder={defaultAddress?.address || '输入送达地址'}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Reward */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>设置赏金</Text>
          <View style={styles.rewardRow}>
            <View style={styles.rewardInput}>
              <Text style={styles.inputLabel}>基础报酬 (元)</Text>
              <View style={styles.priceInput}>
                <Text style={styles.currencySign}>¥</Text>
                <TextInput
                  style={styles.priceTextInput}
                  value={reward}
                  onChangeText={setReward}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.rewardInput}>
              <Text style={styles.inputLabel}>小费 (元)</Text>
              <View style={styles.priceInput}>
                <Text style={styles.currencySign}>¥</Text>
                <TextInput
                  style={styles.priceTextInput}
                  value={tip}
                  onChangeText={setTip}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Quick Reward Buttons */}
          <View style={styles.quickRewards}>
            {quickRewards.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickRewardBtn,
                  reward === amount.toString() && styles.activeQuickReward,
                ]}
                onPress={() => setReward(amount.toString())}
              >
                <Text
                  style={[
                    styles.quickRewardText,
                    reward === amount.toString() && styles.activeQuickRewardText,
                  ]}
                >
                  ¥{amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Urgent Toggle */}
          <TouchableOpacity
            style={styles.urgentToggle}
            onPress={() => setIsUrgent(!isUrgent)}
            activeOpacity={0.7}
          >
            <View style={styles.urgentInfo}>
              <Feather name="zap" size={18} color="#FF6B35" />
              <View>
                <Text style={styles.urgentTitle}>加急订单</Text>
                <Text style={styles.urgentDesc}>加急订单优先展示，更快被接单</Text>
              </View>
            </View>
            <View style={[styles.toggle, isUrgent && styles.toggleActive]}>
              <View style={[styles.toggleDot, isUrgent && styles.toggleDotActive]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Remark */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>备注</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remark}
            onChangeText={setRemark}
            placeholder="其他需要说明的事项..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedType || !title || !pickupAddress || !deliveryAddress || !reward) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedType || !title || !pickupAddress || !deliveryAddress || !reward}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>发布需求</Text>
        </TouchableOpacity>

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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTypeCard: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B3508',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTypeName: {
    color: '#FF6B35',
  },
  card: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
  },
  addressInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  addressTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  rewardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  rewardInput: {
    flex: 1,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySign: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  priceTextInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  quickRewards: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickRewardBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeQuickReward: {
    backgroundColor: '#FF6B35',
  },
  quickRewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeQuickRewardText: {
    color: '#fff',
  },
  urgentToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6B3508',
    borderRadius: 12,
    padding: 16,
  },
  urgentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  urgentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  urgentDesc: {
    fontSize: 12,
    color: '#666',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#FF6B35',
  },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleDotActive: {
    transform: [{ translateX: 20 }],
  },
  submitButton: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 24,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});