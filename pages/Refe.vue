<template>
      <input v-model="city" placeholder="أدخل اسم المدينة" />
      <p v-if="isLoading">جارٍ التحميل...</p>
      <p v-if="weather">الطقس في {{ city }}: {{ weather }}°C</p>
      <p v-if="error">حدث خطأ: {{ error }}</p>

      <input ref="inputElement" placeholder="أدخل النص هنا" />
      <button @click="focusInput">التركيز على الإدخال</button>
   

  </template>
  <script setup>
     import axios from 'axios';
     import _debounce from 'lodash/debounce'; // 
  import { ref, watch } from 'vue';

  


// تعريف عنصر DOM باستخدام ref
const inputElement = ref(null);

// دالة لتركيز الإدخال
const focusInput = () => {
  inputElement.value.focus(); // الوصول إلى العنصر باستخدام .value
};

  
  const city = ref('');
  const weather = ref(null);
  const error = ref(null);
  const isLoading = ref(false); // حالة التحميل
  
  // دالة للإرسال بعد التأخير (debounce) لتقليل عدد الطلبات
  const fetchWeather = _debounce(async (newCity) => {
    if (newCity.trim() === '') {
      weather.value = null;
      error.value = null;
      return;
    }
  
    isLoading.value = true; // تفعيل حالة التحميل
  
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: newCity,
          appid:'841107fc443925a82ea62cde6e92e410', // استخدم مفتاح API الخاص بك
          units: 'metric', // للحصول على درجات الحرارة بالمئوية
        },
      });
         console.log(response.data);
         
      weather.value = response.data.main.temp; // درجة الحرارة في المدينة
      error.value = null; // إعادة تعيين أي خطأ سابق
    } catch (err) {
      weather.value = null;
      error.value = 'فشل في تحميل البيانات. تأكد من اسم المدينة.';
    } finally {
      isLoading.value = false; // إيقاف حالة التحميل عند الانتهاء
    }
  }, 1000); // 1000 ميلي ثانية تأخير بين التحديثات
  
  // مراقبة التغيرات في `city` واستخدام الدالة `debounce` لتقليل عدد الطلبات
  watch(city, (newCity) => {
    fetchWeather(newCity); // سيتم استدعاء `fetchWeather` بعد التأخير المحدد
  });
  </script>






















































