import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

export default function HeroSlider({ sliders = [], onExplore }) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!sliders || sliders.length === 0) return null;
  const slide = sliders[activeIndex];

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
          source={{ uri: slide.image_url || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=1200' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(11, 15, 25, 0.4)', 'rgba(11, 15, 25, 0.95)']}
          style={styles.gradientOverlay}
        />

        <View style={styles.content}>
          <View style={styles.badgeContainer}>
            <Ionicons name="sparkles" size={12} color={colors.rose} />
            <Text style={styles.badgeText}>{slide.badge_text || t('hero_badge')}</Text>
          </View>

          <Text style={styles.title}>{slide.title || t('hero_title')}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{slide.subtitle || t('hero_subtitle')}</Text>

          <TouchableOpacity style={styles.ctaBtn} onPress={onExplore}>
            <Text style={styles.ctaText}>{slide.cta_text || t('cta_explore')}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Carousel controls */}
        {sliders.length > 1 && (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} onPress={prevSlide}>
              <Ionicons name="chevron-back" size={18} color={colors.white} />
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
            <TouchableOpacity style={styles.controlBtn} onPress={nextSlide}>
              <Ionicons name="chevron-forward" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardContainer: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
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
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    marginBottom: 8,
  },
  badgeText: {
    color: '#FF8A9E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 24,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
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
    borderRadius: 8,
  },
  ctaText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    width: 14,
    backgroundColor: colors.primaryLight,
  },
});
