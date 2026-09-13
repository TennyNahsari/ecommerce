import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../api/apiService';
import OrderManagerModal from '../components/OrderManagerModal';
import AddProductModal from '../components/AddProductModal';
import ProductManagerModal from '../components/ProductManagerModal';
import CategoryManagerModal from '../components/CategoryManagerModal';
import InquiryInboxModal from '../components/InquiryInboxModal';
import SliderManagerModal from '../components/SliderManagerModal';
import SettingsManagerModal from '../components/SettingsManagerModal';
import MediaLibraryModal from '../components/MediaLibraryModal';

export default function DashboardScreen({ onNavigate }) {
  const { t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [productManagerVisible, setProductManagerVisible] = useState(false);
  const [categoryManagerVisible, setCategoryManagerVisible] = useState(false);
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [sliderModalVisible, setSliderModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const res = await apiService.getStats();
    setStats(res);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgDark }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <View style={styles.welcomeCard}>
          <View style={styles.userRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user?.name ? user.name[0].toUpperCase() : 'U'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeText}>{t('dash_welcome')}</Text>
              <Text style={styles.userName}>{user?.name || user?.username || 'Pengguna Toko'}</Text>
              <View style={styles.roleBadge}>
                <Ionicons 
                  name={isAdmin ? 'shield-checkmark' : 'person'} 
                  size={12} 
                  color={isAdmin ? colors.primaryLight : colors.emerald} 
                />
                <Text style={[styles.roleText, { color: isAdmin ? colors.primaryLight : colors.emerald }]}>
                  {isAdmin ? t('role_admin') : t('role_customer')}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={18} color={colors.rose} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Metrics Statistics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard')}</Text>
          <Text style={styles.sectionSubtitle}>{t('dash_subtitle')}</Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.statsGrid}>
              <TouchableOpacity style={styles.statCard} onPress={() => setOrderModalVisible(true)}>
                <View style={[styles.statIconBadge, { backgroundColor: 'rgba(14, 165, 233, 0.15)' }]}>
                  <Ionicons name="bag-handle" size={20} color={colors.primaryLight} />
                </View>
                <Text style={styles.statValue}>{stats?.totalOrders || 0}</Text>
                <Text style={styles.statLabel}>{t('stat_total_orders')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statCard} onPress={() => setOrderModalVisible(true)}>
                <View style={[styles.statIconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="time" size={20} color={colors.amber} />
                </View>
                <Text style={styles.statValue}>{stats?.pendingOrders || 0}</Text>
                <Text style={styles.statLabel}>{t('stat_pending_orders')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statCard} onPress={() => setProductManagerVisible(true)}>
                <View style={[styles.statIconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Ionicons name="hardware-chip" size={20} color={colors.emerald} />
                </View>
                <Text style={styles.statValue}>{stats?.totalProducts || 0}</Text>
                <Text style={styles.statLabel}>{t('stat_total_products')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statCard} onPress={() => setInquiryModalVisible(true)}>
                <View style={[styles.statIconBadge, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                  <Ionicons name="chatbubbles" size={20} color={colors.accent} />
                </View>
                <Text style={styles.statValue}>{stats?.totalInquiries || 0}</Text>
                <Text style={styles.statLabel}>{t('stat_inquiries')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Full Store Management Tools Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('store_management_tools')}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionCard} onPress={() => setProductManagerVisible(true)}>
              <Ionicons name="cube-outline" size={22} color={colors.primaryLight} />
              <Text style={styles.actionText}>{t('admin_nav_products')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setCategoryManagerVisible(true)}>
              <Ionicons name="pricetag-outline" size={22} color={colors.accent} />
              <Text style={styles.actionText}>{t('admin_nav_categories')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setOrderModalVisible(true)}>
              <Ionicons name="receipt-outline" size={22} color={colors.emerald} />
              <Text style={styles.actionText}>{t('admin_nav_orders')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setInquiryModalVisible(true)}>
              <Ionicons name="mail-unread-outline" size={22} color={colors.amber} />
              <Text style={styles.actionText}>{t('admin_nav_inquiries')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setSliderModalVisible(true)}>
              <Ionicons name="images-outline" size={22} color={colors.rose} />
              <Text style={styles.actionText}>{t('admin_nav_sliders')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setMediaModalVisible(true)}>
              <Ionicons name="folder-open-outline" size={22} color={colors.primaryLight} />
              <Text style={styles.actionText}>{t('admin_nav_media')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setSettingsModalVisible(true)}>
              <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.actionText}>{t('admin_nav_settings')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('recent_activity')}</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>Pesanan #ORD-1004 Sukses Diproses</Text>
                <Text style={styles.activityTime}>2 jam yang lalu • Kabel NYM 2x1.5mm</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <Ionicons name="notifications" size={18} color={colors.primaryLight} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>Inkuiri Baru dari Pelanggan UMKM</Text>
                <Text style={styles.activityTime}>5 jam yang lalu • Konsultasi lampu toko</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Admin Management Modals */}
      <ProductManagerModal
        visible={productManagerVisible}
        onClose={() => {
          setProductManagerVisible(false);
          loadDashboardData();
        }}
      />

      <CategoryManagerModal
        visible={categoryManagerVisible}
        onClose={() => setCategoryManagerVisible(false)}
      />

      <OrderManagerModal
        visible={orderModalVisible}
        onClose={() => {
          setOrderModalVisible(false);
          loadDashboardData();
        }}
      />

      <AddProductModal
        visible={addProductModalVisible}
        onClose={() => setAddProductModalVisible(false)}
        onSuccess={() => loadDashboardData()}
      />

      <InquiryInboxModal
        visible={inquiryModalVisible}
        onClose={() => setInquiryModalVisible(false)}
      />

      <SliderManagerModal
        visible={sliderModalVisible}
        onClose={() => setSliderModalVisible(false)}
      />

      <MediaLibraryModal
        visible={mediaModalVisible}
        onClose={() => setMediaModalVisible(false)}
      />

      <SettingsManagerModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 20,
  },
  welcomeText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderRadius: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.bgCard,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.bgCard,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  activityTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  activityTime: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
