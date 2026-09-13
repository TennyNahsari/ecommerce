import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image, Alert, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';

export default function MediaLibraryModal({ visible, onClose }) {
  const { t } = useLanguage();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  
  // Add Media Link State
  const [showAddInput, setShowAddInput] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible) loadMedia();
  }, [visible]);

  const loadMedia = async () => {
    setLoading(true);
    const data = await apiService.getMedia();
    setMediaItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleCopyUrl = (url, id) => {
    if (!url) return;
    Clipboard.setString(url);
    setCopiedId(id);
    Alert.alert('Link Disalin! 📋', `URL gambar berhasil disalin ke clipboard:\n${url}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteMedia = (id, filename) => {
    Alert.alert(
      'Hapus Asset Media',
      `Apakah Anda yakin ingin menghapus "${filename || 'file media ini'}" dari server?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await apiService.deleteMedia(id);
            setMediaItems(prev => prev.filter(m => m.id !== id));
            Alert.alert('Sukses', 'Asset media berhasil dihapus!');
          }
        }
      ]
    );
  };

  const handleAddMedia = async () => {
    if (!newMediaUrl.trim()) {
      Alert.alert('Peringatan', 'Mohon masukkan URL link foto/gambar.');
      return;
    }

    setUploading(true);
    const res = await apiService.uploadMedia(newMediaUrl.trim());
    setUploading(false);

    if (res && (res.success || res.data)) {
      Alert.alert('Sukses 🎉', 'File media baru berhasil ditambahkan!');
      setNewMediaUrl('');
      setShowAddInput(false);
      loadMedia();
    } else {
      Alert.alert('Gagal', res?.message || 'Gagal menyimpan media baru.');
    }
  };

  const filteredMedia = mediaItems.filter(m => 
    (m.filename || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.url || m.filepath || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes) => {
    if (!bytes) return 'Media File';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('modal_media_title')}</Text>
              <Text style={styles.subtitle}>Kelola foto produk, banner, & bukti pembayaran ({mediaItems.length} file)</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Top Actions: Search & Add */}
          <View style={styles.topActions}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('search_media_ph')}
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <TouchableOpacity 
              style={styles.addBtn} 
              onPress={() => setShowAddInput(!showAddInput)}
            >
              <Ionicons name={showAddInput ? "close" : "cloud-upload-outline"} size={18} color={colors.white} />
              <Text style={styles.addText}>{showAddInput ? t('btn_cancel') : t('upload_btn')}</Text>
            </TouchableOpacity>
          </View>

          {/* Collapsible Add New Media Input */}
          {showAddInput && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Tambah Link Foto / Asset Gambar Baru:</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="link-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="https://images.unsplash.com/... atau URL foto"
                  placeholderTextColor={colors.textMuted}
                  value={newMediaUrl}
                  onChangeText={setNewMediaUrl}
                />
              </View>
              <TouchableOpacity 
                style={styles.submitMediaBtn} 
                onPress={handleAddMedia} 
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={18} color={colors.white} />
                    <Text style={styles.submitMediaText}>Simpan ke Media Library</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Body List / Grid */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
          ) : (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {filteredMedia.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="images-outline" size={48} color={colors.textMuted} />
                  <Text style={styles.emptyText}>Tidak ada file media ditemukan.</Text>
                </View>
              ) : (
                <View style={styles.mediaGrid}>
                  {filteredMedia.map(item => {
                    const imgUrl = item.url || item.filepath || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800';
                    const fileName = item.filename || `media-${item.id}.jpg`;
                    const isCopied = copiedId === item.id;

                    return (
                      <View key={item.id || fileName} style={styles.mediaCard}>
                        {/* Image Preview Box */}
                        <View style={styles.imageBox}>
                          <Image
                            source={{ uri: imgUrl }}
                            style={styles.mediaImg}
                            resizeMode="cover"
                          />
                          <TouchableOpacity
                            style={styles.deleteBadge}
                            onPress={() => handleDeleteMedia(item.id, fileName)}
                          >
                            <Ionicons name="trash-outline" size={14} color={colors.white} />
                          </TouchableOpacity>
                        </View>

                        {/* File Details */}
                        <View style={styles.cardDetails}>
                          <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
                          <Text style={styles.fileSize}>{formatSize(item.size)}</Text>

                          {/* Copy URL Button */}
                          <TouchableOpacity
                            style={[styles.copyBtn, isCopied && styles.copiedBtn]}
                            onPress={() => handleCopyUrl(imgUrl, item.id)}
                          >
                            <Ionicons 
                              name={isCopied ? "checkmark" : "copy-outline"} 
                              size={14} 
                              color={colors.white} 
                            />
                            <Text style={styles.copyText}>
                              {isCopied ? t('url_copied') : t('copy_url_btn')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          )}
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
  addForm: {
    backgroundColor: colors.bgCard,
    margin: 16,
    marginBottom: 0,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgDark,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12,
  },
  submitMediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.emerald,
    paddingVertical: 9,
    borderRadius: 8,
  },
  submitMediaText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: 16,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    gap: 8,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  mediaCard: {
    width: '48%',
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  imageBox: {
    height: 120,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  mediaImg: {
    width: '100%',
    height: '100%',
  },
  deleteBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(244, 63, 94, 0.85)',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetails: {
    padding: 10,
    gap: 4,
  },
  fileName: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  fileSize: {
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 4,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.4)',
  },
  copiedBtn: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  copyText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
