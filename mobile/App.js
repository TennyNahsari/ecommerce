import * as ExpoModulesCore from 'expo-modules-core';
if (ExpoModulesCore && !ExpoModulesCore.registerWebModule) {
  ExpoModulesCore.registerWebModule = function (moduleClass) {
    return moduleClass;
  };
}

import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { colors } from './src/theme/colors';
import HeaderBar from './src/components/HeaderBar';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import CartScreen from './src/screens/CartScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';

function MainApp() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('Landing');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Landing':
        return <LandingScreen onNavigate={setCurrentScreen} />;
      case 'Catalog':
        return <CatalogScreen onNavigate={setCurrentScreen} />;
      case 'Cart':
        return <CartScreen onNavigate={setCurrentScreen} />;
      case 'OrderTracking':
        return <OrderTrackingScreen />;
      case 'Login':
        return user ? <DashboardScreen onNavigate={setCurrentScreen} /> : <LoginScreen onNavigate={setCurrentScreen} />;
      case 'Dashboard':
        return user ? <DashboardScreen onNavigate={setCurrentScreen} /> : <LoginScreen onNavigate={setCurrentScreen} />;
      default:
        return <LandingScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={colors.bgCard} />
      <HeaderBar onNavigate={setCurrentScreen} />
      
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Mobile Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navTab} 
          onPress={() => setCurrentScreen('Landing')}
        >
          <Ionicons 
            name={currentScreen === 'Landing' ? 'home' : 'home-outline'} 
            size={20} 
            color={currentScreen === 'Landing' ? colors.primaryLight : colors.textMuted} 
          />
          <Text style={[styles.navLabel, currentScreen === 'Landing' && styles.activeNavLabel]}>
            {t('beranda')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab} 
          onPress={() => setCurrentScreen('Catalog')}
        >
          <Ionicons 
            name={currentScreen === 'Catalog' ? 'grid' : 'grid-outline'} 
            size={20} 
            color={currentScreen === 'Catalog' ? colors.primaryLight : colors.textMuted} 
          />
          <Text style={[styles.navLabel, currentScreen === 'Catalog' && styles.activeNavLabel]}>
            {t('katalog')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab} 
          onPress={() => setCurrentScreen('OrderTracking')}
        >
          <Ionicons 
            name={currentScreen === 'OrderTracking' ? 'location' : 'location-outline'} 
            size={20} 
            color={currentScreen === 'OrderTracking' ? colors.primaryLight : colors.textMuted} 
          />
          <Text style={[styles.navLabel, currentScreen === 'OrderTracking' && styles.activeNavLabel]}>
            {t('lacak_pesanan')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navTab} 
          onPress={() => setCurrentScreen(user ? 'Dashboard' : 'Login')}
        >
          <Ionicons 
            name={(currentScreen === 'Login' || currentScreen === 'Dashboard') ? 'person' : 'person-outline'} 
            size={20} 
            color={(currentScreen === 'Login' || currentScreen === 'Dashboard') ? colors.primaryLight : colors.textMuted} 
          />
          <Text style={[styles.navLabel, (currentScreen === 'Login' || currentScreen === 'Dashboard') && styles.activeNavLabel]}>
            {user ? t('dashboard') : t('masuk')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  navLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  activeNavLabel: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
});
