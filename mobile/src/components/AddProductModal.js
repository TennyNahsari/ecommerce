import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';

export default function AddProductModal({ visible, onClose, onSuccess, productToEdit = null }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kabel & Instalasi Listrik');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(productToEdit);

  const categories = [
    'Kabel & Instalasi Listrik',
    'Stop Kontak & Sakelar',
    'Lampu & Penghemat Energi',
    'Komponen & Pengaman MCB'
  ];

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || '');
      setCategory(productToEdit.category_name || 'Kabel & Instalasi Listrik');
      setPrice(productToEdit.price ? String(productToEdit.price) : '');
      setOriginalPrice(productToEdit.original_price ? String(productToEdit.original_price) : '');
      setImageUrl(productToEdit.image_url || '');
      setDescription(productToEdit.description || '');
    } else {
      setTitle('');
      setCategory('Kabel & Instalasi Listrik');
      setPrice('');
      setOriginalPrice('');
      setImageUrl('');
      setDescription('');
    }
  }, [productToEdit, visible]);

  const handleSaveProduct = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Peringatan', 'Mohon isi Nama Produk dan Harga Jual.');
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      category_name: category,
      price: Number(price),
      original_price: originalPrice ? Number(originalPrice) : null,
      discount_percentage: originalPrice ? Math.round((1 - (Number(price) / Number(originalPrice))) * 100) : 0,
      image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800',
      description: description.trim() || 'Produk peralatan listrik berkualitas standar SNI.',
      is_featured: true
    };

    let res;
    if (isEditMode && productToEdit.id) {
      res = await apiService.updateProduct(productToEdit.id, payload);
    } else {
      res = await apiService.addProduct(payload);
    }

    setLoading(false);

    if (res && (res.success || res.data || res.id)) {
      const msg = isEditMode ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan ke katalog!';
      Alert.alert('Sukses 🎉', msg);
      onClose();
      if (onSuccess) onSuccess();
    } else {
      Alert.alert('Gagal', res?.message || 'Gagal menyimpan produk.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{isEditMode ? t('modal_edit_product_title') : t('modal_add_product_title')}</Text>
              <Text style={styles.subtitle}>
                {isEditMode ? 'Perbarui detail dan harga produk' : 'Masukkan detail barang peralatan listrik'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Nama Produk Listrik *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="hardware-chip-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Contoh: Lampu LED 18W Philips Daylight"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <Text style={styles.label}>Kategori Produk</Text>
            <View style={styles.catChips}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Harga Jual (Rp) *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Contoh: 35000"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Harga Coret (Rp)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Contoh: 45000"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={originalPrice}
                    onChangeText={setOriginalPrice}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.label}>URL Foto Produk (Image Link)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="image-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor={colors.textMuted}
                value={imageUrl}
                onChangeText={setImageUrl}
              />
            </View>

            <Text style={styles.label}>Deskripsi & Spesifikasi Singkat</Text>
            <View style={[styles.inputWrapper, { alignItems: 'flex-start' }]}>
              <TextInput
                style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                placeholder="Tuliskan spesifikasi Voltase, Watt, Garansi SNI..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProduct} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name={isEditMode ? "save-outline" : "add-circle"} size={20} color={colors.white} />
                  <Text style={styles.saveText}>{isEditMode ? t('save_changes_btn') : t('save_to_catalog_btn')}</Text>
                </>
              )}
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bgDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
  body: {
    padding: 16,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
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
    fontSize: 13,
  },
  catChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catChip: {
    backgroundColor: colors.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  catChipText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  catChipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
