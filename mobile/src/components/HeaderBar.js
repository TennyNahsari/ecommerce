import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function HeaderBar({ onNavigate }) {
  const { language, toggleLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { totalCount } = useCart();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.brandContainer} onPress={() => onNavigate('Landing')}>
        <View style={styles.logoBadge}>
          <Ionicons name="flash" size={20} color={colors.white} />
        </View>
        <View>
          <Text style={styles.brandTitle}>{t('app_title')}</Text>
          <Text style={styles.brandTagline}>{t('tagline')}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightActions}>
        {/* Language Switcher Badge */}
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
          <Ionicons name="globe-outline" size={16} color={colors.primaryLight} />
          <Text style={styles.langText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>

        {/* Cart Counter */}
        <TouchableOpacity style={styles.iconBtn} onPress={() => onNavigate('Cart')}>
          <Ionicons name="cart-outline" size={22} color={colors.textPrimary} />
          {totalCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* User Account / Login Button */}
        <TouchableOpacity 
          style={[styles.userBtn, user && styles.userBtnActive]} 
          onPress={() => onNavigate(user ? 'Dashboard' : 'Login')}
        >
          <Ionicons 
            name={user ? (user.role === 'ADMIN' ? 'shield-checkmark' : 'person-circle') : 'log-in-outline'} 
            size={18} 
            color={user ? colors.white : colors.textPrimary} 
          />
          <Text style={styles.userBtnText}>
            {user ? (user.role === 'ADMIN' ? 'Admin' : 'User') : t('masuk')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  brandTagline: {
    color: colors.textMuted,
    fontSize: 10,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  langText: {
    color: colors.primaryLight,
    fontWeight: '700',
    fontSize: 12,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.rose,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  userBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBtnActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primary,
  },
  userBtnText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});
