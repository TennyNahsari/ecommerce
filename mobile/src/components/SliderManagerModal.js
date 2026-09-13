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
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (visible) fetchSliders();
  }, [visible]);

  const fetchSliders = async () => {
    setLoading(true);
    const res = await apiService.getSliders();
    setSliders(res);
    setLoading(false);
  };

  const handleAddSlider = async () => {
    if (!title.trim()) {
      Alert.alert('Peringatan', 'Judul Promo Banner wajib diisi.');
      return;
    }
    setAdding(true);
    const newSlide = {
      id: Date.now(),
      title,
      subtitle: subtitle || 'Promo peralatan listrik & lampu LED berkualtas.',
      badge_text: badgeText || 'PROMO TERBARU',
      image_url: imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200'
    };
    setSliders(prev => [newSlide, ...prev]);
    setAdding(false);
    setTitle('');
    setSubtitle('');
    setBadgeText('');
    setImageUrl('');
    Alert.alert('Sukses 🎉', 'Promo Banner baru berhasil ditambahkan!');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('modal_slider_title')}</Text>
              <Text style={styles.subtitle}>{t('slider_subtitle')}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Form Add Slider */}
            <View style={styles.formBox}>
              <Text style={styles.formTitle}>+ {t('add_slider_btn')}</Text>
              
              <Text style={styles.label}>Judul Promo *</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Diskon Lampu LED Garansi 1 Tahun"
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <Text style={styles.label}>Subjudul / Deskripsi Promo</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Deskripsi singkat penawaran..."
                  placeholderTextColor={colors.textMuted}
                  value={subtitle}
                  onChangeText={setSubtitle}
                />
              </View>

              <Text style={styles.label}>Teks Badge Promo</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: PROMO SPESIAL UMKM"
                  placeholderTextColor={colors.textMuted}
                  value={badgeText}
                  onChangeText={setBadgeText}
                />
              </View>

              <Text style={styles.label}>URL Gambar Banner</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="https://images.unsplash.com/..."
                  placeholderTextColor={colors.textMuted}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                />
              </View>

              <TouchableOpacity style={styles.addBtn} onPress={handleAddSlider} disabled={adding}>
                <Ionicons name="images" size={16} color={colors.white} />
                <Text style={styles.addBtnText}>{t('add_slider_btn')}</Text>
              </TouchableOpacity>
            </View>

            {/* List Sliders */}
            <Text style={styles.sectionHeader}>Daftar Banner Promo Aktif</Text>
            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : (
              sliders.map(item => (
                <View key={item.id} style={styles.sliderCard}>
                  <Image source={{ uri: item.image_url }} style={styles.sliderImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sliderBadge}>{item.badge_text}</Text>
                    <Text style={styles.sliderTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.sliderSub} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
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
    color: colors.rose,
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
});
