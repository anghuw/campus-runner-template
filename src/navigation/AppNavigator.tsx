import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

// Pages
import HomePage from '../pages/HomePage';
import OrdersPage from '../pages/OrdersPage';
import PublishPage from '../pages/PublishPage';
import MessagesPage from '../pages/MessagesPage';
import ProfilePage from '../pages/ProfilePage';
import OrderDetailPage from '../pages/OrderDetailPage';
import ChatPage from '../pages/ChatPage';
import RunnerPage from '../pages/RunnerPage';
import SearchPage from '../pages/SearchPage';
import RatingPage from '../pages/RatingPage';
import LoginPage from '../pages/LoginPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ name, color, size, badge }: { name: string; color: string; size: number; badge?: number }) => (
  <View style={{ position: 'relative' }}>
    <Feather name={name as any} size={size} color={color} />
    {badge && badge > 0 ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
      </View>
    ) : null}
  </View>
);

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          let badge = 0;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Orders') {
            iconName = 'clipboard';
          } else if (route.name === 'Publish') {
            iconName = 'plus-circle';
          } else if (route.name === 'Messages') {
            iconName = 'message-square';
            badge = 2;
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <TabIcon name={iconName} color={color} size={size} badge={badge} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomePage} options={{ tabBarLabel: '首页' }} />
      <Tab.Screen name="Orders" component={OrdersPage} options={{ tabBarLabel: '订单' }} />
      <Tab.Screen
        name="Publish"
        component={PublishPage}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.publishButton}>
              <Feather name="plus-circle" size={32} color="#FF6B35" />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Messages" component={MessagesPage} options={{ tabBarLabel: '消息' }} />
      <Tab.Screen name="Profile" component={ProfilePage} options={{ tabBarLabel: '我的' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f5f5f5' },
        }}
      >
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen name="OrderDetail" component={OrderDetailPage} />
        <Stack.Screen name="Chat" component={ChatPage} />
        <Stack.Screen name="Runner" component={RunnerPage} />
        <Stack.Screen name="Search" component={SearchPage} />
        <Stack.Screen name="Rating" component={RatingPage} />
        <Stack.Screen name="Login" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  publishButton: {
    marginBottom: 20,
  },
});