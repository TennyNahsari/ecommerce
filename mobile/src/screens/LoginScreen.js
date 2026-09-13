import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ onNavigate }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (usr, pwd) => {
    const targetUser = usr !== undefined ? usr : username;
    const targetPwd = pwd !== undefined ? pwd : password;

    if (!targetUser || !targetPwd) {
      setErrorMessage(t('invalid_login'));
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const res = await login(targetUser, targetPwd);
    setLoading(false);

    if (res.success) {
      onNavigate('Dashboard');
    } else {
      setErrorMessage(res.message || t('invalid_login'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={28} color={colors.primaryLight} />
          </View>
          <Text style={styles.title}>{t('login_title')}</Text>
          <Text style={styles.subtitle}>{t('login_subtitle')}</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={colors.rose} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={styles.label}>{t('username_label')}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder={t('username_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>{t('password_label')}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="key-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder={t('password_placeholder')}
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={() => handleLogin()} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Text style={styles.submitText}>{t('login_btn')}</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Fast Login Options */}
        <View style={styles.demoDivider}>
          <View style={styles.line} />
          <Text style={styles.demoDividerText}>Demo Mode</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.demoButtons}>
          <TouchableOpacity 
            style={styles.demoAdminBtn} 
            onPress={() => handleLogin('admin', 'admin123')}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.primaryLight} />
            <Text style={styles.demoAdminText}>{t('demo_admin_login')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.demoUserBtn} 
            onPress={() => handleLogin('pelanggan', 'user123')}
          >
            <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.demoUserText}>{t('demo_customer_login')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  errorText: {
    color: colors.rose,
    fontSize: 12,
    flex: 1,
  },
  form: {
    gap: 12,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  submitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  demoDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  demoDividerText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  demoButtons: {
    gap: 10,
  },
  demoAdminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  demoAdminText: {
    color: colors.primaryLight,
    fontWeight: '600',
    fontSize: 13,
  },
  demoUserBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.bgElevated,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoUserText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
});
