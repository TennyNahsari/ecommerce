import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/apiService';

export default function OrderTrackingScreen() {
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [ordersResult, setOrdersResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatPrice = (val) => 'Rp ' + Number(val || 0).toLocaleString('id-ID');

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setSearched(true);
    setErrorMsg('');
    setOrdersResult(null);

    const res = await apiService.trackOrder(orderId.trim());
    setLoading(false);

    if (res && res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : [res.data];
      setOrdersResult(list);
    } else {
      setOrdersResult(null);
      setErrorMsg(res?.message || 'Pesanan tidak ditemukan dengan Kode Pesanan / No. WA tersebut.');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED' || s === 'SELESAI') {
      return { label: t('status_completed'), color: colors.emerald, bg: 'rgba(16, 185, 129, 0.2)' };
    }
    if (s === 'SHIPPED' || s === 'DIKIRIM') {
      return { label: t('status_shipped'), color: colors.primaryLight, bg: 'rgba(14, 165, 233, 0.2)' };
    }
    if (s === 'PROCESSING' || s === 'DIPROSES' || s === 'PAID') {
      return { label: t('status_processing'), color: colors.amber, bg: 'rgba(245, 158, 11, 0.2)' };
    }
    if (s === 'CANCELLED' || s === 'BATAL') {
      return { label: t('status_cancelled'), color: colors.rose, bg: 'rgba(244, 63, 94, 0.2)' };
    }
    return { label: t('status_pending'), color: colors.amber, bg: 'rgba(245, 158, 11, 0.2)' };
  };

  const getTimelineSteps = (status) => {
    const s = (status || '').toUpperCase();
    const isCancelled = s === 'CANCELLED' || s === 'BATAL';

    if (isCancelled) {
      return [
        { title: t('status_pending'), done: true },
        { title: t('status_cancelled'), done: true, isFail: true }
      ];
    }

    const isPaid = s === 'PAID' || s === 'PROCESSING' || s === 'SHIPPED' || s === 'COMPLETED' || s === 'SELESAI';
    const isProcessing = s === 'PROCESSING' || s === 'SHIPPED' || s === 'COMPLETED' || s === 'SELESAI';
    const isShipped = s === 'SHIPPED' || s === 'COMPLETED' || s === 'SELESAI';
    const isCompleted = s === 'COMPLETED' || s === 'SELESAI';

    return [
      { title: t('status_pending'), done: true },
      { title: 'Verifikasi Pembayaran', done: isPaid },
      { title: t('status_processing'), done: isProcessing },
      { title: t('status_shipped'), done: isShipped },
      { title: t('status_completed'), done: isCompleted }
    ];
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconBadge}>
            <Ionicons name="location" size={24} color={colors.primaryLight} />
          </View>
          <Text style={styles.title}>{t('track_title')}</Text>
          <Text style={styles.subtitle}>{t('track_subtitle')}</Text>
          
          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              placeholder={t('track_placeholder')}
              placeholderTextColor={colors.textMuted}
              value={orderId}
              onChangeText={setOrderId}
              onSubmitEditing={handleTrack}
            />
            <TouchableOpacity style={styles.trackBtn} onPress={handleTrack}>
              <Ionicons name="search" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
        ) : searched ? (
          ordersResult && ordersResult.length > 0 ? (
            ordersResult.map((ord, orderIdx) => {
              const badge = getStatusBadge(ord.status);
              const steps = getTimelineSteps(ord.status);
              const code = ord.order_code || ord.order_number || ('TLJ-' + ord.id);
              
              let parsedItems = [];
              if (Array.isArray(ord.items)) {
                parsedItems = ord.items;
              } else if (typeof ord.items === 'string') {
                try { parsedItems = JSON.parse(ord.items); } catch(e) { parsedItems = []; }
              }

              return (
                <View key={ord.id || orderIdx} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ordNum}>{code}</Text>
                      <Text style={styles.ordCust}>
                        {ord.customer_name} • {ord.customer_phone}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>

                  {/* Items Breakdown */}
                  <View style={styles.itemsBox}>
                    <Text style={styles.itemsTitle}>{t('item_breakdown_title')}</Text>
                    {parsedItems.map((it, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          • {it.product_title || it.title || 'Item Produk'}
                        </Text>
                        <Text style={styles.itemQtyPrice}>
                          {it.quantity}x @ {formatPrice(it.price)}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>{t('total_bill_label')}</Text>
                      <Text style={styles.totalVal}>{formatPrice(ord.total_amount)}</Text>
                    </View>
                  </View>

                  {/* Status Timeline Progress */}
                  <Text style={styles.timelineHeaderTitle}>{t('order_status_flow_title')}</Text>
                  <View style={styles.timeline}>
                    {steps.map((step, idx) => (
                      <View key={idx} style={styles.timelineItem}>
                        <Ionicons 
                          name={step.isFail ? "close-circle" : (step.done ? "checkmark-circle" : "ellipse-outline")} 
                          size={20} 
                          color={step.isFail ? colors.rose : (step.done ? colors.emerald : colors.textMuted)} 
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.timelineTitle, step.done && { color: colors.textPrimary }, step.isFail && { color: colors.rose }]}>
                            {step.title}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.notFoundCard}>
              <Ionicons name="alert-circle-outline" size={36} color={colors.rose} />
              <Text style={styles.notFoundText}>{errorMsg || t('track_not_found')}</Text>
            </View>
          )
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
    padding: 16,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: 10,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
  },
  trackBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  resultCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
    marginBottom: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 12,
    gap: 8,
  },
  ordNum: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  ordCust: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemsBox: {
    backgroundColor: colors.bgDark,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 6,
  },
  itemsTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    color: colors.textPrimary,
    fontSize: 12,
    flex: 1,
  },
  itemQtyPrice: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  totalVal: {
    color: colors.emerald,
    fontSize: 14,
    fontWeight: '800',
  },
  timelineHeaderTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  timeline: {
    gap: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timelineTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  notFoundCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notFoundText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});
