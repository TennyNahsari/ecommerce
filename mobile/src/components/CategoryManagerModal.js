import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';

export default function CategoryManagerModal({ visible, onClose }) {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (visible) fetchCategories();
  }, [visible]);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await apiService.getCategories();
    setCategories(res);
    setLoading(false);
  };

  const handleAddCategory = () => {
    if (!catName.trim()) {
      Alert.alert('Peringatan', 'Nama kategori wajib diisi.');
      return;
    }
    setAdding(true);
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id: Date.now(),
      name: catName,
      slug: slug,
      icon: 'hardware-chip'
    };
    setCategories(prev => [...prev, newCat]);
    setCatName('');
    setCatSlug('');
    setAdding(false);
    Alert.alert('Sukses 🎉', `Kategori "${catName}" berhasil ditambahkan!`);
  };

  const handleDeleteCategory = (id, name) => {
    Alert.alert(
      'Hapus Kategori',
      `Yakin ingin menghapus kategori "${name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setCategories(prev => prev.filter(c => c.id !== id));
            Alert.alert('Sukses', 'Kategori telah dihapus.');
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('modal_category_title')}</Text>
              <Text style={styles.subtitle}>Kelola daftar kategori & kelompok barang listrik</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Add Category Form */}
            <View style={styles.formBox}>
              <Text style={styles.formTitle}>+ {t('add_category_btn')}</Text>

              <Text style={styles.label}>{t('category_name_label')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="pricetag-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Stop Kontak & Sakelar"
                  placeholderTextColor={colors.textMuted}
                  value={catName}
                  onChangeText={setCatName}
                />
              </View>

              <Text style={styles.label}>{t('slug_label')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="link-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: stop-kontak-sakelar"
                  placeholderTextColor={colors.textMuted}
                  value={catSlug}
                  onChangeText={setCatSlug}
                />
              </View>

              <TouchableOpacity style={styles.addBtn} onPress={handleAddCategory} disabled={adding}>
                <Ionicons name="add-circle" size={16} color={colors.white} />
                <Text style={styles.addBtnText}>{t('add_category_btn')}</Text>
              </TouchableOpacity>
            </View>

            {/* Category List */}
            <Text style={styles.sectionHeader}>{t('active_categories')} ({categories.length})</Text>

            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : (
              categories.map(item => (
                <View key={item.id} style={styles.catCard}>
                  <View style={styles.catIconCircle}>
                    <Ionicons name="hardware-chip-outline" size={18} color={colors.primaryLight} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.catTitle}>{item.name}</Text>
                    <Text style={styles.catSlug}>slug: /{item.slug}</Text>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteCategory(item.id, item.name)}>
                    <Ionicons name="trash-outline" size={18} color={colors.rose} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
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
  body: {
    padding: 16,
  },
  formBox: {
    backgroundColor: colors.bgCard,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    gap: 8,
  },
  formTitle: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  addBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  catCard: {
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
  catIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  catSlug: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  deleteBtn: {
    padding: 6,
  },
});
