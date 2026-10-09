import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';

export default function SliderManagerModal({ visible, onClose }) {
  const { t } = useLanguage();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form fields matching Web SliderManager
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('PROMO SPESIAL UMKM');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Lihat Katalog Produk');
  const [ctaLink, setCtaLink] = useState('Catalog');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (visible) fetchSliders();
  }, [visible]);

  const fetchSliders = async () => {
    setLoading(true);
    const res = await apiService.getSliders();
    setSliders(res || []);
    setLoading(false);
  };

  const handleAddSlider = async () => {
    if (!title.trim()) {
      Alert.alert('Peringatan', 'Judul Headline Utama wajib diisi.');
      return;
    }
    const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200';
    setAdding(true);
    
    const sliderData = {
      title,
      subtitle: subtitle || 'Solusi kebutuhan peralatan & perlengkapan listrik berkualitas.',
      badge_text: badgeText || 'PROMO SPESIAL UMKM',
      image_url: finalImage,
      cta_text: ctaText || 'Lihat Katalog Produk',
      cta_link: ctaLink || 'Catalog'
    };

    const res = await apiService.addSlider(sliderData);
    setAdding(false);

    if (res && res.success !== false) {
      setTitle('');
      setSubtitle('');
      setBadgeText('PROMO SPESIAL UMKM');
      setImageUrl('');
      setCtaText('Lihat Katalog Produk');
      setCtaLink('Catalog');
      Alert.alert('Sukses 🎉', 'Slide Banner Hero berhasil ditambahkan!');
      fetchSliders();
    } else {
      Alert.alert('Gagal', res?.message || 'Gagal menambahkan slide banner.');
    }
  };

  const handleDeleteSlider = (id, titleText) => {
    Alert.alert(
      'Hapus Slide Hero',
      `Apakah Anda yakin ingin menghapus slide "${titleText}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            const res = await apiService.deleteSlider(id);
            if (res && res.success !== false) {
              Alert.alert('Sukses', 'Slide berhasil dihapus.');
              fetchSliders();
            } else {
              Alert.alert('Gagal', res?.message || 'Gagal menghapus slide.');
            }
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
              <Text style={styles.title}>{t('modal_slider_title') || 'Kelola Hero Slider Promo'}</Text>
              <Text style={styles.subtitle}>{t('slider_subtitle') || 'Kelola carousel banner hero beranda & teks promo'}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Form Add Slider */}
            <View style={styles.formBox}>
              <Text style={styles.formTitle}>+ Tambah Slide Hero Baru</Text>
              
              <Text style={styles.label}>Judul Headline Utama *</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Pusat Peralatan Listrik UMKM Terlengkap"
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <Text style={styles.label}>Teks Badge Promo / Tagline</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. PROMO SPESIAL UMKM"
                  placeholderTextColor={colors.textMuted}
                  value={badgeText}
                  onChangeText={setBadgeText}
                />
              </View>

              <Text style={styles.label}>URL Gambar Banner Slide</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="https://images.unsplash.com/..."
                  placeholderTextColor={colors.textMuted}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                />
              </View>

              {imageUrl ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
                </View>
              ) : null}

              <Text style={styles.label}>Subjudul / Deskripsi Promo</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { height: 50 }]}
                  multiline
                  placeholder="Solusi kebutuhan kabel, stop kontak, sakelar..."
                  placeholderTextColor={colors.textMuted}
                  value={subtitle}
                  onChangeText={setSubtitle}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Teks Tombol (CTA)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Lihat Katalog"
                      placeholderTextColor={colors.textMuted}
                      value={ctaText}
                      onChangeText={setCtaText}
                    />
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Target Link / Aksi</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Catalog"
                      placeholderTextColor={colors.textMuted}
                      value={ctaLink}
                      onChangeText={setCtaLink}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.addBtn, adding && { opacity: 0.6 }]} 
                onPress={handleAddSlider} 
                disabled={adding}
              >
                {adding ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Ionicons name="images" size={16} color={colors.white} />
                    <Text style={styles.addBtnText}>Simpan Slide Hero</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* List Sliders */}
            <Text style={styles.sectionHeader}>Daftar Slide Banner Hero Aktif ({sliders.length})</Text>
            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : sliders.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center', marginVertical: 20 }}>
                Belum ada banner hero yang terdaftar.
              </Text>
            ) : (
              sliders.map(item => (
                <View key={item.id} style={styles.sliderCard}>
                  <Image source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200' }} style={styles.sliderImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sliderBadge}>{item.badge_text || 'PROMO'}</Text>
                    <Text style={styles.sliderTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.sliderSub} numberOfLines={1}>{item.subtitle}</Text>
                    <Text style={styles.sliderCta} numberOfLines={1}>
                      Tombol: {item.cta_text || 'Lihat Katalog'} ({item.cta_link || 'Catalog'})
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteSlider(item.id, item.title)}
                  >
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
    backgroundColor: colors.bgElevated,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  previewContainer: {
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 4,
  },
  previewImage: {
    width: '100%',
    height: '100%',
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
  sliderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    gap: 10,
  },
  sliderImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  sliderBadge: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  sliderTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  sliderSub: {
    color: colors.textMuted,
    fontSize: 11,
  },
  sliderCta: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderRadius: 8,
  },
});
