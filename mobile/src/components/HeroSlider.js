import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function HeroSlider({ sliders = [], onExplore }) {
  const { lang, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sliders || sliders.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliders]);

  if (!sliders || sliders.length === 0) return null;
  const slide = sliders[activeIndex] || sliders[0];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: slide.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(8, 20, 37, 0.35)', 'rgba(8, 20, 37, 0.95)']}
          style={styles.gradientOverlay}
        />

        <View style={styles.content}>
          {/* Header Row: Promo Badge & Slide Counter */}
          <View style={styles.badgeRow}>
            <View style={styles.badgeContainer}>
              <Ionicons name="sparkles" size={12} color={colors.accent} />
              <Text style={styles.badgeText}>{slide.badge_text || t('hero_badge') || 'PROMO SPESIAL UMKM'}</Text>
            </View>

            {sliders.length > 1 && (
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>
                  0{activeIndex + 1} / 0{sliders.length}
                </Text>
              </View>
            )}
          </View>

          {/* Headline & Subtitle */}
          <Text style={styles.title} numberOfLines={2}>{slide.title || t('hero_title')}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{slide.subtitle || t('hero_subtitle')}</Text>

          {/* CTA Action Button */}
          <TouchableOpacity style={styles.ctaBtn} onPress={onExplore} activeOpacity={0.85}>
            <Text style={styles.ctaText}>{slide.cta_text || t('hero_cta_1') || 'Lihat Katalog Produk'}</Text>
            <Ionicons name="arrow-forward" size={15} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Carousel slide controls */}
        {sliders.length > 1 && (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} onPress={prevSlide} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={16} color={colors.white} />
            </TouchableOpacity>
            
            <View style={styles.indicators}>
              {sliders.map((_, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => setActiveIndex(idx)}
                  style={[styles.dot, idx === activeIndex && styles.activeDot]} 
                />
              ))}
            </View>

            <TouchableOpacity style={styles.controlBtn} onPress={nextSlide} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Key Metric Highlights Bar (Matches Website Hero Metrics) */}
      <View style={styles.metricsBar}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: colors.primaryLight }]}>99.4%</Text>
          <Text style={styles.metricLabel}>{lang === 'en' ? 'Satisfaction' : 'Kepuasan'}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: colors.accent }]}>100%</Text>
          <Text style={styles.metricLabel}>{lang === 'en' ? 'SNI Certified' : 'Standar SNI'}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: colors.emerald }]}>5.000+</Text>
          <Text style={styles.metricLabel}>{lang === 'en' ? 'Shipped' : 'Terkirim'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardContainer: {
    height: 235,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.4)',
  },
  badgeText: {
    color: '#C7D2FE',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  counterBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  counterText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 22,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    marginBottom: 12,
    lineHeight: 16,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  ctaText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  controls: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  controlBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  indicators: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  activeDot: {
    width: 16,
    backgroundColor: colors.primaryLight,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.bgCard,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
    textTransform: 'uppercase',
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
});
