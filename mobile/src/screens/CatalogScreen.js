import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

export default function CatalogScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  // Pagination State (3 Products per page / 3 items view)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const touchStartRef = useRef(0);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchCatalog();
  }, []);

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(0);
  }, [search, selectedCat]);

  const fetchCatalog = async () => {
    setLoading(true);
    const [pList, cList] = await Promise.all([
      apiService.getProducts(),
      apiService.getCategories()
    ]);
    setProducts(pList);
    setCategories(cList);
    setLoading(false);
  };

  const handleProductPress = (prod) => {
    setSelectedProduct(prod);
    setDetailModalVisible(true);
  };

  const filtered = products.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCat || item.category_name === selectedCat || item.category_slug === selectedCat;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);
  const startIndex = safeCurrentPage * itemsPerPage;
  const displayedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder={t('search_product_ph')}
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Categories Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <TouchableOpacity
              style={[styles.chip, !selectedCat && styles.activeChip]}
              onPress={() => setSelectedCat(null)}
            >
              <Text style={[styles.chipText, !selectedCat && styles.activeChipText]}>{t('view_all')}</Text>
            </TouchableOpacity>
            {categories.map(cat => {
              const isSel = selectedCat === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, isSel && styles.activeChip]}
                  onPress={() => setSelectedCat(isSel ? null : cat.name)}
                >
                  <Text style={[styles.chipText, isSel && styles.activeChipText]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Product List Showcase */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <Text style={styles.noDataText}>Tidak ada produk ditemukan.</Text>
        ) : (
          <View style={{ paddingTop: 12 }}>
            {/* Swipeable Container for 3 Products View */}
            <View 
              style={styles.grid}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {displayedProducts.map(item => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onPress={() => handleProductPress(item)}
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

                  {/* Dot Indicators */}
                  <View style={styles.dotsContainer}>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const isActive = idx === safeCurrentPage;
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => setCurrentPage(idx)}
                          style={[styles.dot, isActive && styles.activeDot]}
                        />
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
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} / {filtered.length} • {t('swipe_hint_mobile')}
                </Text>
              </View>
            )}
          </View>
        )}
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
  searchHeader: {
    padding: 16,
    backgroundColor: colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },
  chipRow: {
    gap: 8,
  },
  chip: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  grid: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  paginationWrapper: {
    alignItems: 'center',
    marginVertical: 16,
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
    gap: 6,
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
  noDataText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    width: '100%',
  },
});

