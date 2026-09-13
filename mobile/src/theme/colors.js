// Theme colors and styling constants for DigiAgency Mobile
export const colors = {
  bgDark: '#0B0F19',
  bgCard: '#151D2A',
  bgElevated: '#1E293B',
  bgGlass: 'rgba(30, 41, 59, 0.7)',
  
  primary: '#0EA5E9',      // Ocean cyan / blue
  primaryLight: '#38BDF8',
  primaryDark: '#0284C7',
  
  accent: '#6366F1',       // Indigo
  accentGradient: ['#0EA5E9', '#6366F1'],
  
  emerald: '#10B981',      // Success / WhatsApp green
  amber: '#F59E0B',        // Warning / Star rating
  rose: '#F43F5E',         // Promo badge / Danger
  
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  
  border: '#334155',
  borderLight: '#1E293B',
  
  white: '#FFFFFF',
  black: '#000000',
};

export const typography = {
  titleLarge: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  titleMedium: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  titleSmall: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 14, color: colors.textSecondary },
  bodyBold: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  caption: { fontSize: 12, color: colors.textMuted },
};
