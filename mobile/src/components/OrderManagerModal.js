import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';

export default function OrderManagerModal({ visible, onClose }) {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (visible) {
      fetchOrders();
    }
  }, [visible]);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await apiService.getOrders();
    setOrders(res);
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const res = await apiService.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      Alert.alert('Sukses', `Status order #${orderId} telah diperbarui menjadi "${newStatus}"`);
      fetchOrders();
    }
  };

  const handleContactCustomer = (phone, orderNum) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(`Halo, kami dari DigiAgency Store mengenai pesanan Anda #${orderNum}...`);
    Linking.openURL(`https://wa.me/${targetPhone}?text=${msg}`).catch(() => {
      Alert.alert('Info', `Nomor HP Pelanggan: ${phone}`);
    });
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  const formatPrice = (val) => 'Rp ' + Number(val || 0).toLocaleString('id-ID');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('modal_order_title')}</Text>
              <Text style={styles.subtitle}>Kelola status pesanan & pengiriman pelanggan</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={26} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Status Filter Chips */}
          <View style={styles.filterRow}>
            {['ALL', 'PENDING', 'Diproses', 'Selesai', 'Dibatalkan'].map(st => (
              <TouchableOpacity
                key={st}
                style={[styles.filterChip, statusFilter === st && styles.filterChipActive]}
                onPress={() => setStatusFilter(st)}
              >
                <Text style={[styles.filterText, statusFilter === st && styles.filterTextActive]}>{st}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
          ) : (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              {filteredOrders.length === 0 ? (
                <Text style={styles.emptyText}>Tidak ada pesanan pada kategori ini.</Text>
              ) : (
                filteredOrders.map(item => (
                  <View key={item.id} style={styles.orderCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.orderNum}>{item.order_number || `ORD-${item.id}`}</Text>
                        <Text style={styles.custName}>{item.customer_name} ({item.customer_phone})</Text>
                      </View>
                      <View style={[styles.statusBadge, item.status === 'Selesai' && styles.statusDone]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    </View>

                    <Text style={styles.addressText} numberOfLines={2}>📍 {item.shipping_address}</Text>

                    <View style={styles.amountRow}>
                      <Text style={styles.payMethod}>💳 {item.payment_method}</Text>
                      <Text style={styles.totalVal}>{formatPrice(item.total_amount)}</Text>
                    </View>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.waBtn}
                        onPress={() => handleContactCustomer(item.customer_phone, item.order_number)}
                      >
                        <Ionicons name="logo-whatsapp" size={14} color={colors.emerald} />
                        <Text style={styles.waBtnText}>Hubungi WA</Text>
                      </TouchableOpacity>

                      <View style={styles.statusButtons}>
                        <TouchableOpacity
                          style={[styles.stBtn, item.status === 'Diproses' && styles.stBtnActive]}
                          onPress={() => handleUpdateStatus(item.id, 'Diproses')}
                        >
                          <Text style={styles.stBtnText}>Diproses</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.stBtn, item.status === 'Selesai' && styles.stBtnActiveDone]}
                          onPress={() => handleUpdateStatus(item.id, 'Selesai')}
                        >
                          <Text style={styles.stBtnText}>Selesai</Text>
                        </TouchableOpacity>
                      </View>
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterChip: {
    backgroundColor: colors.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
  body: {
    padding: 16,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 30,
  },
  orderCard: {
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
  },
  orderNum: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  custName: {
    color: colors.primaryLight,
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  addressText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  payMethod: {
    color: colors.textMuted,
    fontSize: 11,
  },
  totalVal: {
    color: colors.emerald,
    fontSize: 14,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  waBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  waBtnText: {
    color: colors.emerald,
    fontSize: 11,
    fontWeight: '700',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  stBtn: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  stBtnActiveDone: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  stBtnText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
});
