import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { formatDistance, formatPrice, getStatusLabel, getOrderTypeLabel } from '../utils';

const hotSearches = ['代取快递', '代买午餐', '代打印', '代送文件', '代买水果'];
const recentSearches = ['韵达快递', '麻辣香锅', '论文打印'];

const OrderCard = ({ order, onPress }: { order: any; onPress: () => void }) => (
  <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.orderHeader}>
      <View style={styles.orderTypeContainer}>
        <View style={[styles.orderTypeIcon, { backgroundColor: '#FF6B3515' }]}>
          <Feather name="package" size={16} color="#FF6B35" />
        </View>
        <Text style={styles.orderType}>{getOrderTypeLabel(order.type)}</Text>
      </View>
      <Text style={styles.orderPrice}>¥{formatPrice(order.reward + order.tip)}</Text>
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
  </TouchableOpacity>
);

export default function SearchPage() {
  const navigation = useNavigation<any>();
  const { orders } = useStore();
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (!searchText.trim()) return false;
    const keyword = searchText.toLowerCase();
    return (
      order.title.toLowerCase().includes(keyword) ||
      order.description.toLowerCase().includes(keyword) ||
      order.pickupAddress.toLowerCase().includes(keyword) ||
      order.deliveryAddress.toLowerCase().includes(keyword)
    );
  });

  const handleSearch = (keyword: string) => {
    setSearchText(keyword);
    setIsSearching(true);
  };

  const handleClear = () => {
    setSearchText('');
    setIsSearching(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsSearching(true)}
            placeholder="搜索跑腿服务..."
            placeholderTextColor="#999"
            autoFocus
          />
          {searchText ? (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Feather name="x" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => handleSearch(searchText)}>
          <Text style={styles.searchButton}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {!isSearching ? (
        <View style={styles.suggestionsContainer}>
          {/* Hot Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="trending-up" size={16} color="#FF6B35" />
              <Text style={styles.sectionTitle}>热门搜索</Text>
            </View>
            <View style={styles.tagContainer}>
              {hotSearches.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  style={styles.tag}
                  onPress={() => handleSearch(keyword)}
                >
                  <Text style={styles.tagText}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="clock" size={16} color="#666" />
              <Text style={styles.sectionTitle}>最近搜索</Text>
            </View>
            <View style={styles.recentList}>
              {recentSearches.map((keyword) => (
                <TouchableOpacity
                  key={keyword}
                  style={styles.recentItem}
                  onPress={() => handleSearch(keyword)}
                >
                  <Feather name="clock" size={14} color="#999" />
                  <Text style={styles.recentText}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          {searchText.trim() ? (
            <>
              <Text style={styles.resultCount}>找到 {filteredOrders.length} 个相关订单</Text>
              <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <OrderCard
                    order={item}
                    onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
                  />
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                      <Feather name="search" size={48} color="#ccc" />
                    </View>
                    <Text style={styles.emptyText}>未找到相关订单</Text>
                    <Text style={styles.emptySubtext}>换个关键词试试</Text>
                  </View>
                }
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>输入关键词搜索</Text>
            </View>
          )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
  suggestionsContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  recentList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  recentText: {
    fontSize: 15,
    color: '#666',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
  orderRoute: {
    flexDirection: 'row',
    alignItems: 'center',
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