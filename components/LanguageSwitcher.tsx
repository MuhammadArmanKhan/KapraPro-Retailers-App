import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, language === 'en' && styles.activeButton]}
        onPress={() => setLanguage('en')}
      >
        <Text style={[styles.text, language === 'en' && styles.activeText]}>
          EN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, language === 'ur' && styles.activeButton]}
        onPress={() => setLanguage('ur')}
      >
        <Text style={[styles.text, language === 'ur' && styles.activeText]}>
          اردو
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 4,
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#000',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeText: {
    color: '#FFF',
  },
});