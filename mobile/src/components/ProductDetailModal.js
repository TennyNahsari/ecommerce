import React, { useState } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ visible, product, onClose, onBuyNow }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const formatPrice = (val) => 'Rp ' + Number(val || 0).toLocaleString('id-ID');

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close-circle" size={28} color={colors.white} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: product.image_url || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800' }}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.body}>
              <View style={styles.tagRow}>
                <View style={styles.catBadge}>
                  <Text style={styles.catText}>{product.category_name || 'Komponen Listrik'}</Text>
                </View>
                <View style={styles.sniBadge}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.emerald} />
                  <Text style={styles.sniText}>{t('sni_certified')}</Text>
                </View>
              </View>

              <Text style={styles.title}>{product.title}</Text>

              <View style={styles.priceContainer}>
                {product.original_price ? (
                  <Text style={styles.origPrice}>{formatPrice(product.original_price)}</Text>
                ) : null}
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{formatPrice(product.price)}</Text>
                  {product.discount_percentage ? (
                    <View style={styles.discBadge}>
                      <Text style={styles.discText}>{t('save_disc')} {product.discount_percentage}%</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionHeader}>{t('desc_title')}</Text>
              <Text style={styles.description}>{product.description || t('default_desc')}</Text>

              <View style={styles.specsBox}>
                <View style={styles.specItem}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={colors.emerald} />
                  <Text style={styles.specText}>{t('warranty_1_year')}</Text>
                </View>
                <View style={styles.specItem}>
                  <Ionicons name="cube-outline" size={16} color={colors.primaryLight} />
                  <Text style={styles.specText}>{t('ready_ship_today')}</Text>
                </View>
                <View style={styles.specItem}>
                  <Ionicons name="flame-outline" size={16} color={colors.amber} />
                  <Text style={styles.specText}>{t('copper_anti_melt')}</Text>
                </View>
              </View>

              {/* Quantity selector */}
              <View style={styles.qtyContainer}>
                <Text style={styles.qtyLabel}>{t('qty_purchase')}</Text>
                <View style={styles.qtyControl}>
                  <TouchableOpacity 
                    style={styles.qtyBtn} 
                    onPress={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    <Ionicons name="remove" size={16} color={colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{quantity}</Text>
                  <TouchableOpacity 
                    style={styles.qtyBtn} 
                    onPress={() => setQuantity(q => q + 1)}
                  >
                    <Ionicons name="add" size={16} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
              <Ionicons name="cart-outline" size={18} color={colors.white} />
              <Text style={styles.addCartText}>{t('add_to_cart_short')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.buyNowBtn} 
              onPress={() => {
                handleAddToCart();
                if (onBuyNow) onBuyNow();
              }}
            >
              <Ionicons name="flash" size={18} color={colors.white} />
              <Text style={styles.buyNowText}>{t('buy_now')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bgDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  body: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  catBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catText: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  sniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sniText: {
    color: colors.emerald,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 24,
  },
  priceContainer: {
    marginBottom: 12,
  },
  origPrice: {
    color: colors.textMuted,
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    color: colors.emerald,
    fontSize: 22,
    fontWeight: '800',
  },
  discBadge: {
    backgroundColor: colors.rose,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  sectionHeader: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  specsBox: {
    backgroundColor: colors.bgCard,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    marginBottom: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgCard,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    backgroundColor: colors.bgElevated,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNum: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  footerActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addCartText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  buyNowBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.emerald,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buyNowText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
