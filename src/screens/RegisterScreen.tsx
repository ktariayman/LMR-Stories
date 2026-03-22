import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { Colors } from '../constants/colors';
import { useTranslation } from '../i18n';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuthStore();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    if (!username.trim() || !password.trim()) return;
    clearError();
    try {
      await register(username.trim(), password, displayName.trim() || undefined);
      router.replace('/(tabs)/');
    } catch {}
  }

  const canSubmit = username.trim().length >= 3 && password.length >= 6;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>🌟</Text>
            <Text style={styles.title}>{t('register.title')}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('register.title')} 📚</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>{t('register.username')} <Text style={styles.hint}>({t('register.usernameHint')})</Text></Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.usernamePlaceholder')}
              placeholderTextColor="#C4A882"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>{t('register.displayName')} <Text style={styles.hint}>({t('register.displayNameHint')})</Text></Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.displayNamePlaceholder')}
              placeholderTextColor="#C4A882"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text style={styles.label}>{t('register.password')} <Text style={styles.hint}>({t('register.passwordHint')})</Text></Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.passwordPlaceholder')}
              placeholderTextColor="#C4A882"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading || !canSubmit}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('register.button')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={styles.switchRow}>
              <Text style={styles.switchText}>{t('register.hasAccount')} </Text>
              <Text style={[styles.switchText, styles.switchLink]}>{t('register.signIn')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 72, marginBottom: 8 },
  title: { fontSize: 34, fontWeight: '900', color: Colors.primary, letterSpacing: -0.5 },
  subtitle: { fontSize: 18, color: Colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: '#DC2626', fontSize: 14, fontWeight: '600' },
  label: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  hint: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary },
  input: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: 16,
    backgroundColor: '#FFFAF5',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: Colors.white, fontSize: 18, fontWeight: '900' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchText: { fontSize: 16, color: Colors.textSecondary },
  switchLink: { color: Colors.primary, fontWeight: '800' },
});
