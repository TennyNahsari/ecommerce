import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { apiService } from '../api/apiService';

export default function CheckoutModal({ visible, onClose, onSuccess }) {
  const { t } = useLanguage();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank BCA');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (val) => 'Rp ' + Number(val || 0).toLocaleString('id-ID');

  const handleSubmitOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Peringatan', 'Mohon lengkapi Nama, No. WhatsApp, dan Alamat Pengiriman.');
      return;
    }

    setSubmitting(true);

    // Format items as array of objects expected by the backend API (matches website flow)
    const itemsPayload = cartItems.map(item => ({
      service_id: item.id,
      product_title: item.title,
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 1
    }));

    const orderPayload = {
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      shipping_address: address.trim(),
      payment_method: paymentMethod,
      total_amount: cartTotal,
      notes: notes.trim(),
      items: itemsPayload
    };

    const res = await apiService.createOrder(orderPayload);
    setSubmitting(false);

    if (res && (res.success || res.data)) {
      const orderData = res.data || {};
      const orderCode = orderData.order_code || orderData.order_number || res.order_number || ('TLJ-' + Math.floor(1000 + Math.random() * 9000));
      const isMerged = Boolean(res.is_merged);

      // Build WhatsApp message
      const itemsList = cartItems.map(item => `- ${item.title} (${item.quantity}x)`).join('\n');
      const mergeNoticeWA = isMerged ? `*CATATAN: ITEM DIGABUNGKAN KE KODE PESANAN AKTIF*\n` : '';

      const waText = encodeURIComponent(
        `*PESANAN BARU VIA DIGIAGENCY MOBILE*\n` +
        `----------------------------------------\n` +
        `${mergeNoticeWA}` +
        `Kode Pesanan: *${orderCode}*\n` +
        `Nama: ${name.trim()}\n` +
        `No. WA: ${phone.trim()}\n` +
        `Alamat: ${address.trim()}\n` +
        `Metode Pembayaran: ${paymentMethod}\n` +
        `Catatan: ${notes.trim() || '-'}\n\n` +
        `*DAFTAR ITEM PESANAN:*\n${itemsList}\n\n` +
        `*TOTAL TAGIHAN: ${formatPrice(cartTotal)}*\n` +
        `----------------------------------------\n` +
        `Mohon segera diproses & dikirimkan instruksi pembayaran. Terima kasih!`
      );

      const waUrl = `https://wa.me/6281234567890?text=${waText}`;

      clearCart();
      onClose();

      const alertTitle = isMerged ? 'Item Berhasil Digabungkan! ⚡' : 'Pesanan Berhasil dibuat! 🎉';
      const alertMsg = isMerged
        ? `Item baru otomatis digabungkan ke Kode Pesanan Aktif Anda: ${orderCode}.\n\nIngin membuka WhatsApp untuk konfirmasi pesanan ke admin toko?`
        : `Kode Pesanan Anda: ${orderCode}\n\nIngin membuka WhatsApp untuk konfirmasi pesanan ke admin toko?`;

      Alert.alert(
        alertTitle,
        alertMsg,
        [
          { text: 'Nanti Saja', onPress: () => onSuccess && onSuccess(orderCode) },
          {
            text: 'Buka WhatsApp',
            onPress: () => {
              Linking.openURL(waUrl).catch(() => {});
              if (onSuccess) onSuccess(orderCode);
            }
          }
        ]
      );
    } else {
      Alert.alert('Gagal', res.message || 'Terjadi kesalahan saat memproses pesanan.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('checkout_title')}</Text>
              <Text style={styles.subtitle}>{t('checkout_subtitle')}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Auto-merge Tip Banner (Matches Website Order Form) */}
            <View style={styles.tipBox}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primaryLight} style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>{t('tip_multi_order_title')}</Text>
                <Text style={styles.tipDesc}>
                  {t('tip_multi_order_desc')}
                </Text>
              </View>
            </View>

            {/* Form Fields */}
            <Text style={styles.label}>{t('name_label')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder={t('name_placeholder')}
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>{t('phone_label')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="logo-whatsapp" size={18} color={colors.emerald} />
              <TextInput
                style={styles.input}
                placeholder={t('phone_placeholder')}
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <Text style={styles.label}>{t('address_label')}</Text>
            <View style={[styles.inputWrapper, { alignItems: 'flex-start' }]}>
              <Ionicons name="location-outline" size={18} color={colors.textMuted} style={{ marginTop: 2 }} />
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder={t('address_placeholder')}
                placeholderTextColor={colors.textMuted}
                multiline
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <Text style={styles.label}>{t('payment_method_label')}</Text>
            <View style={styles.paymentOptions}>
              {['Transfer Bank BCA', 'Transfer Bank BRI', 'Transfer Mandiri', 'COD (Bayar di Tempat)', 'E-Wallet (GoPay/OVO)'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[styles.payOption, paymentMethod === method && styles.payOptionSelected]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Ionicons
                    name={paymentMethod === method ? "checkmark-circle" : "ellipse-outline"}
                    size={16}
                    color={paymentMethod === method ? colors.primaryLight : colors.textMuted}
                  />
                  <Text style={[styles.payOptionText, paymentMethod === method && styles.payOptionTextSelected]}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>{t('notes_label')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="document-text-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder={t('notes_placeholder')}
                placeholderTextColor={colors.textMuted}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Summary preview */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>{t('summary_title')}</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('item_subtotal_label')}</Text>
                <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('shipping_fee_label')}</Text>
                <Text style={styles.summaryValueFree}>{t('free_shipping')}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>{t('total_bill_label')}</Text>
                <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Submit Action */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitOrder} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={20} color={colors.white} />
                  <Text style={styles.submitText}>{t('confirm_order_btn')}</Text>
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
  tipBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    marginBottom: 8,
  },
  tipTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  tipDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
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
  paymentOptions: {
    gap: 6,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgCard,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  payOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
  },
  payOptionText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  payOptionTextSelected: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: colors.bgCard,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
    marginBottom: 20,
    gap: 6,
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  summaryValueFree: {
    color: colors.emerald,
    fontSize: 11,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  totalValue: {
    color: colors.emerald,
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.emerald,
    paddingVertical: 12,
    borderRadius: 10,
  },
  submitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
