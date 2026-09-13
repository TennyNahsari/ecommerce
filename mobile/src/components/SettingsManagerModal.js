import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsManagerModal({ visible, onClose }) {
  const { t } = useLanguage();
  const [storeName, setStoreName] = useState('DigiAgency Toko Listrik UMKM');
  const [phone, setPhone] = useState('081234567890');
  const [email, setEmail] = useState('admin@digiagency.com');
  const [address, setAddress] = useState('Jl. Raya Kendangsari No. 88, Surabaya, Jawa Timur');
  const [bcaBank, setBcaBank] = useState('8291028471 a.n. Toko Listrik Jaya');
  const [briBank, setBriBank] = useState('00120194829103 a.n. Toko Listrik Jaya');

  const handleSaveSettings = () => {
    Alert.alert('Sukses 🎉', 'Pengaturan Toko & Rekening Pembayaran berhasil diperbarui!');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('store_contact_settings')}</Text>
              <Text style={styles.subtitle}>Atur nama toko, WhatsApp, dan nomor rekening</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Nama Toko / Usaha *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="storefront-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                value={storeName}
                onChangeText={setStoreName}
              />
            </View>

            <Text style={styles.label}>No. WhatsApp Toko *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="logo-whatsapp" size={18} color={colors.emerald} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={styles.label}>Email Operasional</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Alamat Lengkap Toko Fisik</Text>
            <View style={[styles.inputWrapper, { alignItems: 'flex-start' }]}>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>

            <Text style={styles.sectionHeader}>Rekening Bank Pembayaran</Text>

            <Text style={styles.label}>Rekening BCA</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color={colors.primaryLight} />
              <TextInput
                style={styles.input}
                value={bcaBank}
                onChangeText={setBcaBank}
              />
            </View>

            <Text style={styles.label}>Rekening BRI</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color={colors.amber} />
              <TextInput
                style={styles.input}
                value={briBank}
                onChangeText={setBriBank}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSettings}>
              <Ionicons name="save-outline" size={18} color={colors.white} />
              <Text style={styles.saveText}>{t('save_settings_btn')}</Text>
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
  sectionHeader: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 4,
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
    fontSize: 14,
  },
});
