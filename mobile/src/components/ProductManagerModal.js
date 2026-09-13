import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';
import AddProductModal from './AddProductModal';

export default function ProductManagerModal({ visible, onClose }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (visible) fetchProducts();
  }, [visible]);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await apiService.getProducts();
    setProducts(res);
    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setAddModalVisible(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setAddModalVisible(true);
  };

  const handleDeleteProduct = (id, title) => {
    Alert.alert(
      'Hapus Produk',
      `Yakin ingin menghapus produk "${title}" dari katalog?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await apiService.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            Alert.alert('Sukses', 'Produk berhasil dihapus dari katalog.');
          }
        }
      ]
    );
  };

  const handleToggleStock = (id) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStock = p.stock_status === 'ready' ? 'out' : 'ready';
          return { ...p, stock_status: nextStock };
        }
        return p;
      })
    );
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const formatPrice = (val) => 'Rp ' + Number(val || 0).toLocaleString('id-ID');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('admin_nav_products')}</Text>
              <Text style={styles.subtitle}>Kelola stok, harga, & daftar barang toko ({products.length} produk)</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Search & Add Action Header */}
          <View style={styles.topActions}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('search_product_ph')}
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleOpenAddModal}>
              <Ionicons name="add" size={18} color={colors.white} />
              <Text style={styles.addText}>{t('add_btn')}</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
          ) : (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {filtered.length === 0 ? (
                <Text style={styles.emptyText}>Tidak ada produk ditemukan.</Text>
              ) : (
                filtered.map(item => (
                  <View key={item.id} style={styles.prodCard}>
                    <Image
                      source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800' }}
                      style={styles.prodImg}
                    />

                    <View style={{ flex: 1 }}>
                      <Text style={styles.catText}>{item.category_name || 'Komponen Listrik'}</Text>
                      <Text style={styles.prodTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.prodPrice}>{formatPrice(item.price)}</Text>
                    </View>

                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={[styles.stockBadge, item.stock_status === 'ready' ? styles.stockReady : styles.stockOut]}
                        onPress={() => handleToggleStock(item.id)}
                      >
                        <Text style={styles.stockBadgeText}>
                          {item.stock_status === 'ready' ? t('in_stock') : t('out_of_stock')}
                        </Text>
                      </TouchableOpacity>

                      <View style={styles.actionBtnRow}>
                        <TouchableOpacity style={styles.editBtn} onPress={() => handleOpenEditModal(item)}>
                          <Ionicons name="create-outline" size={18} color={colors.primaryLight} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteProduct(item.id, item.title)}>
                          <Ionicons name="trash-outline" size={18} color={colors.rose} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          )}

          {/* Add / Edit Product Nested Modal */}
          <AddProductModal
            visible={addModalVisible}
            productToEdit={editingProduct}
            onClose={() => {
              setAddModalVisible(false);
              setEditingProduct(null);
            }}
            onSuccess={() => fetchProducts()}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bgDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  topActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  addText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  body: {
    padding: 16,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 30,
  },
  prodCard: {
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
  prodImg: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  catText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: '600',
  },
  prodTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  prodPrice: {
    color: colors.emerald,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  cardActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockReady: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  stockOut: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
  },
  stockBadgeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtn: {
    padding: 4,
  },
  deleteBtn: {
    padding: 4,
  },
});
