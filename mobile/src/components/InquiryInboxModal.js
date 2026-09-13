import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';

export default function InquiryInboxModal({ visible, onClose }) {
  const { t } = useLanguage();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchInquiries();
    }
  }, [visible]);

  const fetchInquiries = async () => {
    setLoading(true);
    const res = await apiService.getInquiries();
    setInquiries(res);
    setLoading(false);
  };

  const handleReplyWhatsApp = (phone, subject) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(`Halo, merespon pesan konsultasi Anda mengenai "${subject}"...`);
    Linking.openURL(`https://wa.me/${targetPhone}?text=${msg}`).catch(() => {
      Alert.alert('Info', `Nomor Telepon: ${phone}`);
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('modal_inquiry_title')}</Text>
              <Text style={styles.subtitle}>{t('inquiry_subtitle')}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
          ) : (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {inquiries.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada inkuiri pesan masuk.</Text>
              ) : (
                inquiries.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subject}>{item.subject}</Text>
                        <Text style={styles.sender}>{item.name} ({item.email || item.phone})</Text>
                      </View>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.status || 'Baru'}</Text>
                      </View>
                    </View>

                    <Text style={styles.message}>{item.message}</Text>

                    <View style={styles.cardFooter}>
                      <Text style={styles.timeText}>📞 {item.phone || '-'}</Text>
                      <TouchableOpacity
                        style={styles.replyBtn}
                        onPress={() => handleReplyWhatsApp(item.phone, item.subject)}
                      >
                        <Ionicons name="logo-whatsapp" size={14} color={colors.white} />
                        <Text style={styles.replyText}>{t('reply_wa_btn')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
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
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 30,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  subject: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  sender: {
    color: colors.primaryLight,
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  message: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    backgroundColor: colors.bgElevated,
    padding: 10,
    borderRadius: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.emerald,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replyText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
