import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import CheckoutModal from '../components/CheckoutModal';

export default function CartScreen({ onNavigate }) {
  const { t } = useLanguage();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  const formatPrice = (val) => 'Rp ' + Number(val || 0).toLocaleString('id-ID');

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>{t('cart_empty_title')}</Text>
          <Text style={styles.emptySubtitle}>{t('cart_empty_desc')}</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => onNavigate('Catalog')}>
            <Text style={styles.exploreText}>{t('cta_explore')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.itemList}>
            {cartItems.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <Image 
                  source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800' }} 
                  style={styles.itemImage} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                  
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}>
                      <Ionicons name="remove" size={14} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
                      <Ionicons name="add" size={14} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={colors.rose} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footerSummary}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('total_payment')}</Text>
              <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCheckoutModalVisible(true)}>
              <Ionicons name="logo-whatsapp" size={18} color={colors.white} />
              <Text style={styles.checkoutText}>{t('order_via_wa')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Interactive Checkout Modal Form */}
      <CheckoutModal
        visible={checkoutModalVisible}
        onClose={() => setCheckoutModalVisible(false)}
        onSuccess={(orderNum) => {
          onNavigate('OrderTracking');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exploreText: {
    color: colors.white,
    fontWeight: '700',
  },
  itemList: {
    flex: 1,
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    gap: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  itemPrice: {
    color: colors.emerald,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  qtyBtn: {
    backgroundColor: colors.bgElevated,
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 6,
  },
  footerSummary: {
    padding: 16,
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  totalValue: {
    color: colors.emerald,
    fontSize: 18,
    fontWeight: '700',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.emerald,
    paddingVertical: 12,
    borderRadius: 10,
  },
  checkoutText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
