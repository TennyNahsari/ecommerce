import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

export default function LandingScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [sliders, setSliders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Pagination State (3 Products per page / 3 items view)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const touchStartRef = useRef(0);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    const [sliderRes, catRes, prodRes] = await Promise.all([
      apiService.getSliders(),
      apiService.getCategories(),
      apiService.getProducts()
    ]);
    setSliders(sliderRes || []);
    setCategories(catRes || []);
    setProducts(prodRes || []);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const [sliderRes, catRes, prodRes] = await Promise.all([
      apiService.getSliders(),
      apiService.getCategories(),
      apiService.getProducts()
    ]);
    setSliders(sliderRes || []);
    setCategories(catRes || []);
    setProducts(prodRes || []);
    setRefreshing(false);
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategory || item.category_name === selectedCategory || item.category_slug === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);
  const startIndex = safeCurrentPage * itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const pages = [];
    const current = safeCurrentPage;

    pages.push(0, 1);
    if (current > 2) {
      pages.push('ellipsis-1');
    }
    if (current > 1 && current < totalPages - 2) {
      pages.push(current);
    }
    if (current < totalPages - 3) {
      pages.push('ellipsis-2');
    }
    pages.push(totalPages - 2, totalPages - 1);

    return pages.filter((item, idx, self) => self.indexOf(item) === idx);
  };

  // Touch Swipe Handlers for mobile horizontal paging
  const handleTouchStart = (e) => {
    touchStartRef.current = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.nativeEvent.pageX;
    const diff = touchStartRef.current - touchEnd;
    const minSwipeDistance = 40;

    if (diff > minSwipeDistance) {
      handleNextPage();
    } else if (diff < -minSwipeDistance) {
      handlePrevPage();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgDark }}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primaryLight} colors={[colors.primary]} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('search_product_ph')}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Hero Slider */}
        <HeroSlider sliders={sliders} onExplore={() => onNavigate('Catalog')} />

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t('cat_title')}</Text>
            <Text style={styles.sectionSubtitle}>{t('cat_subtitle')}</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('Catalog')}>
            <Text style={styles.seeAllText}>{t('view_all')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChips}>
          <TouchableOpacity 
            style={[styles.chip, !selectedCategory && styles.activeChip]}
            onPress={() => setSelectedCategory(null)}
          >
            <Ionicons name="grid-outline" size={14} color={!selectedCategory ? colors.white : colors.textSecondary} />
            <Text style={[styles.chipText, !selectedCategory && styles.activeChipText]}>{t('view_all')}</Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name || selectedCategory === cat.slug;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isSelected && styles.activeChip]}
                onPress={() => setSelectedCategory(isSelected ? null : cat.name)}
              >
                <Ionicons name="hardware-chip-outline" size={14} color={isSelected ? colors.white : colors.textSecondary} />
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Products Showcase Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t('featured_title')}</Text>
            <Text style={styles.sectionSubtitle}>{t('featured_subtitle')}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View>
            {/* Swipeable Container for 3 Products View */}
            <View 
              style={styles.productGrid}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {displayedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onPress={() => handleProductPress(prod)}
                />
              ))}
            </View>

            {/* Horizontal Side Pagination Controls */}
            {totalPages > 1 && (
              <View style={styles.paginationWrapper}>
                <View style={styles.paginationBar}>
                  {/* Previous Page Button */}
                  <TouchableOpacity 
                    style={styles.pageBtn} 
                    onPress={handlePrevPage}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={18} color={colors.white} />
                  </TouchableOpacity>

                  {/* Number Indicators (Beberapa awal, ..., beberapa akhir) */}
                  <View style={styles.dotsContainer}>
                    {getPageNumbers().map((item) => {
                      if (typeof item === 'string') {
                        return (
                          <Text key={item} style={{ color: colors.textMuted, fontSize: 12, marginHorizontal: 2 }}>
                            ...
                          </Text>
                        );
                      }
                      const isActive = item === safeCurrentPage;
                      return (
                        <TouchableOpacity
                          key={item}
                          onPress={() => setCurrentPage(item)}
                          style={[
                            styles.numBtn,
                            isActive && styles.activeNumBtn
                          ]}
                        >
                          <Text style={[styles.numBtnText, isActive && styles.activeNumBtnText]}>
                            {item + 1}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Next Page Button */}
                  <TouchableOpacity 
                    style={styles.pageBtn} 
                    onPress={handleNextPage}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-forward" size={18} color={colors.white} />
                  </TouchableOpacity>
                </View>

                {/* Page Counter & Swipe Tip */}
                <Text style={styles.paginationText}>
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} / {filteredProducts.length} • {t('swipe_hint_mobile')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* CTA Banner */}
        <TouchableOpacity style={styles.ctaCard} activeOpacity={0.85} onPress={() => onNavigate('Cart')}>
          <View style={styles.ctaIconBadge}>
            <Ionicons name="logo-whatsapp" size={28} color={colors.emerald} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>{t('cta_banner_title')}</Text>
            <Text style={styles.ctaDesc}>{t('cta_banner_desc')}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={detailModalVisible}
        product={selectedProduct}
        onClose={() => setDetailModalVisible(false)}
        onBuyNow={() => {
          setDetailModalVisible(false);
          onNavigate('Cart');
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
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  seeAllText: {
    color: colors.primaryLight,
    fontWeight: '600',
    fontSize: 13,
  },
  categoryChips: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgCard,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeChipText: {
    color: colors.white,
  },
  productGrid: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  paginationWrapper: {
    alignItems: 'center',
    marginVertical: 12,
    gap: 6,
  },
  paginationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  pageBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  numBtn: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeNumBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  numBtnText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  activeNumBtnText: {
    color: colors.white,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 18,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primaryLight,
  },
  paginationText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  ctaCard: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ctaIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  ctaDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});

