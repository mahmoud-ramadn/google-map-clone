<template>
    <div>
      <!-- عرض النص المترجم -->
      <p>{{ $t('welcome') }}</p>
  
      <!-- عرض قائمة الروابط -->
      <ul class=" w-32 bg-yellow-300">
{{ $t('bref') }}
      </ul>
  
      <!-- أزرار لتبديل اللغة -->
      <button @click="changeLanguage('en')">English</button>
      <button @click="changeLanguage('ar')">العربية</button>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n';
  
  const { locale } = useI18n(); // الوصول إلى خاصية locale للتحكم في اللغة الحالية
  
  // دالة لتغيير اللغة
  const changeLanguage = (lang) => {
    locale.value = lang; // تغيير اللغة الحالية
  };
  </script>
  