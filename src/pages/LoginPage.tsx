import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../stores/useStore';
import { isApiMode } from '../api/client';

export default function LoginPage() {
  const navigation = useNavigation<any>();
  const { login, register, loading } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleSubmit = async () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('提示', '请输入11位手机号');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('提示', '密码至少6位');
      return;
    }
    if (isRegister && !nickname) {
      Alert.alert('提示', '请输入昵称');
      return;
    }

    if (!isApiMode()) {
      // Mock mode: just login
      await login(phone, password);
      Alert.alert('成功', 'Mock模式登录成功', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    try {
      if (isRegister) {
        await register(phone, nickname, password, studentId || undefined);
        Alert.alert('成功', '注册成功', [
          { text: '确定', onPress: () => navigation.goBack() },
        ]);
      } else {
        await login(phone, password);
        Alert.alert('成功', '登录成功', [
          { text: '确定', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err: any) {
      Alert.alert('失败', err.message || '操作失败');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isRegister ? '注册' : '登录'}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Mode indicator */}
        <View style={styles.modeTag}>
          <Text style={styles.modeTagText}>
            {isApiMode() ? '🔗 API 模式' : '📦 Mock 模式'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>手机号</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="请输入手机号"
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          {isRegister && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="请输入昵称"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>密码</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="请输入密码"
              secureTextEntry
            />
          </View>

          {isRegister && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>学号 (选填)</Text>
              <TextInput
                style={styles.input}
                value={studentId}
                onChangeText={setStudentId}
                placeholder="请输入学号"
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.submitBtnText}>
              {loading ? '请稍候...' : isRegister ? '注册' : '登录'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => setIsRegister(!isRegister)}
          >
            <Text style={styles.switchBtnText}>
              {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
            </Text>
          </TouchableOpacity>

          {!isApiMode() && (
            <Text style={styles.mockHint}>
              当前为 Mock 模式，登录仅为演示。{'\n'}
              设置 EXPO_PUBLIC_API_BASE_URL 可连接后端。
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  modeTag: {
    alignSelf: 'center', marginTop: 16, paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: '#f5f5f5', borderRadius: 12,
  },
  modeTagText: { fontSize: 12, color: '#888' },
  form: { padding: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#333',
  },
  submitBtn: {
    backgroundColor: '#FF6B35', borderRadius: 8,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  switchBtn: { alignItems: 'center', marginTop: 16 },
  switchBtnText: { color: '#FF6B35', fontSize: 14 },
  mockHint: { textAlign: 'center', color: '#aaa', fontSize: 12, marginTop: 24, lineHeight: 18 },
});
