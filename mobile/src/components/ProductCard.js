import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onPress }) {
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const formatPrice = (amount) => {
    return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800' }}
          style={styles.image}
          resizeMode="cover"
        />
        {product.discount_percentage ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount_percentage}%</Text>
          </View>
        ) : null}
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>{t('in_stock')}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.categoryText}>{product.category_name || 'Komponen Listrik'}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.amber} />
          <Text style={styles.ratingText}>{product.rating || '4.9'}</Text>
          <Text style={styles.ratingCount}>(SNI)</Text>
        </View>

        <View style={styles.priceRow}>
          <View>
            {product.original_price ? (
              <Text style={styles.originalPrice}>{formatPrice(product.original_price)}</Text>
            ) : null}
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>

          <TouchableOpacity 
            style={styles.addCartBtn} 
            onPress={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <Ionicons name="cart" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  imageContainer: {
    height: 130,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.rose,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  details: {
    padding: 10,
  },
  categoryText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    height: 36,
    lineHeight: 18,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  ratingCount: {
    color: colors.textMuted,
    fontSize: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  originalPrice: {
    color: colors.textMuted,
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  price: {
    color: colors.emerald,
    fontSize: 14,
    fontWeight: '700',
  },
  addCartBtn: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 8,
  },
});
