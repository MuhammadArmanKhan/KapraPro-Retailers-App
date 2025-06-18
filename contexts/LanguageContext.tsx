import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Splash & Welcome
    appName: 'KapraPro',
    tagline: 'Connecting Fabric Traders Nationwide',
    welcome: 'Welcome to KapraPro',
    getStarted: 'Get Started',
    
    // Phone Login
    enterPhone: 'Enter Your Phone Number',
    phoneHint: 'We\'ll send you a verification code',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '03XX XXXXXXX',
    continue: 'Continue',
    
    // OTP
    verifyPhone: 'Verify Your Phone',
    otpSent: 'We sent a 4-digit code to',
    enterOtp: 'Enter verification code',
    resendCode: 'Resend Code',
    verifying: 'Verifying...',
    verify: 'Verify',
    
    // Profile
    completeProfile: 'Complete Your Profile',
    profileHint: 'Tell us about your business',
    name: 'Full Name',
    shopName: 'Shop Name',
    market: 'Market/Area',
    cnic: 'CNIC (Optional)',
    namePlaceholder: 'Enter your full name',
    shopPlaceholder: 'Enter your shop name',
    marketPlaceholder: 'Enter your market or area',
    cnicPlaceholder: 'XXXXX-XXXXXXX-X',
    completeSetup: 'Complete Setup',
    
    // Tabs
    home: 'Home',
    catalog: 'Catalog',
    orders: 'Orders',
    profile: 'Profile',
  },
  ur: {
    // Splash & Welcome
    appName: 'کپڑا پرو',
    tagline: 'ملک بھر میں کپڑا تاجروں کو جوڑنا',
    welcome: 'کپڑا پرو میں خوش آمدید',
    getStarted: 'شروع کریں',
    
    // Phone Login
    enterPhone: 'اپنا فون نمبر درج کریں',
    phoneHint: 'ہم آپ کو تصدیقی کوڈ بھیجیں گے',
    phoneLabel: 'فون نمبر',
    phonePlaceholder: '03XX XXXXXXX',
    continue: 'جاری رکھیں',
    
    // OTP
    verifyPhone: 'اپنا فون تصدیق کریں',
    otpSent: 'ہم نے 4 ہندسوں کا کوڈ بھیجا',
    enterOtp: 'تصدیقی کوڈ درج کریں',
    resendCode: 'کوڈ دوبارہ بھیجیں',
    verifying: 'تصدیق ہو رہی ہے...',
    verify: 'تصدیق کریں',
    
    // Profile
    completeProfile: 'اپنا پروفائل مکمل کریں',
    profileHint: 'اپنے کاروبار کے بارے میں بتائیں',
    name: 'پورا نام',
    shopName: 'دکان کا نام',
    market: 'بازار/علاقہ',
    cnic: 'شناختی کارڈ (اختیاری)',
    namePlaceholder: 'اپنا پورا نام درج کریں',
    shopPlaceholder: 'اپنی دکان کا نام درج کریں',
    marketPlaceholder: 'اپنا بازار یا علاقہ درج کریں',
    cnicPlaceholder: 'XXXXX-XXXXXXX-X',
    completeSetup: 'سیٹ اپ مکمل کریں',
    
    // Tabs
    home: 'گھر',
    catalog: 'کیٹالاگ',
    orders: 'آرڈرز',
    profile: 'پروفائل',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}