<template>
  <div class="container mx-auto">
    <client-only>
      <div class="relative">
        <GoogleMap
          api-key="AIzaSyAmqmnMKDFq1urlcUYWXaMynmXTWIxbggg"
          style="width: 100%; height: 500px"
          class="rounded-xl overflow-hidden"
          :center="center"
          :zoom="7"
          @click="onMapClick"
          :libraries="['places']"
          ref="mapRef"
        >
          <Marker :options="{ position: center }" />
        </GoogleMap>

        <div class="absolute top-0 start-0 w-full z-10 flex justify-center p-6">
          <input
            type="text"
            placeholder="Search .."
            class="border h-10 rounded-xl border-gray-200 px-6 outline-0 shadow-md text-sm"
            @input="onInputChange"
          />
        </div>

        <div class="flex flex-col space-y-4 mt-4">
          <div class="flex flex-col space-y-2">
            <label for="country">Country</label>
            <input
              type="text"
              v-model="Counter"
              class="w-60 h-10 rounded-md bg-yellow-200 outline-cyan-300 outline-1 border-2"
              id="country"
              placeholder="Enter country"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label for="state">State</label>
            <input
              type="text"
              v-model="State"
              class="w-60 h-10 rounded-md bg-yellow-200 outline-cyan-300 outline-1 border-2"
              id="state"
              placeholder="Enter state"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <label for="city">City</label>
            <input
              type="text"
              v-model="city"
              class="w-60 h-10 rounded-md bg-yellow-200 outline-cyan-300 outline-1 border-2"
              id="city"
              placeholder="Enter city"
            />
          </div>
         
        </div>
      </div>

      <template #placeholder>
        <p
          class="font-bold text-center text-2xl p-10 rounded-xl bg-red-100"
          style="height: 500px"
        >
          Map is loading ...
        </p>
      </template>
    </client-only>
  </div>
</template>


<script lang="ts" setup>
import { GoogleMap, Marker } from "vue3-google-map";
import { debounce } from "lodash-es";

// Reactive variables
const Counter = ref("");
const State = ref("");
const city = ref("");
const area = ref("");
const center = ref({ lat: 31.4175, lng: 31.8144 });
const mapRef = ref<any>(null);

// Google Maps API Key
const apiKey = "AIzaSyAmqmnMKDFq1urlcUYWXaMynmXTWIxbggg";

// Initialize Geocoder
let geocoder: google.maps.Geocoder | null = null;
watch(
  () => mapRef.value?.ready,
  (value) => {
    if (value && !geocoder) {
      geocoder = new google.maps.Geocoder();
    }
  },
  { immediate: true }
);

// Fetch geographic data from API
const fetchGeometricData = async (lat: number, lng: number) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    if (data.results.length) {
      const locationData = data.results[0].address_components;
      Counter.value = locationData.find((c) =>
        c.types.includes("country")
      )?.long_name || "";
      State.value = locationData.find((c) =>
        c.types.includes("administrative_area_level_1")
      )?.long_name || "";
      city.value = locationData.find((c) =>
        c.types.includes("locality")
      )?.long_name || "";
      area.value = locationData.find((c) =>
        c.types.includes("sublocality")
      )?.long_name || "";
    }
    city.value=data.results[0].address_components[1].long_name;
    
  } catch (error) {
    console.error("Error fetching geometric data:", error);
  }
};

// Handle map click event
const onMapClick = async (value: any) => {
  if (!value) return;
  const lat = value?.latLng?.lat();
  const lng = value?.latLng?.lng();
  center.value = { lat, lng };
  await fetchGeometricData(lat, lng);
};

// Debounced search input change handler
const onInputChange = debounce(async (e: Event) => {
  const searchVal = (e.target as HTMLInputElement)?.value;
  if (!searchVal || searchVal.length < 3 || !geocoder) return;

  try {
    const results = await geocoder.geocode({ address: searchVal });
    if (results.results.length) {
      const location = results.results[0].geometry.location;
      center.value = { lat: location.lat(), lng: location.lng() };
      const locationData = results.results[0].address_components;
      Counter.value = locationData.find((c) =>
        c.types.includes("country")
      )?.long_name || "";
      State.value = locationData.find((c) =>
        c.types.includes("administrative_area_level_1")
      )?.long_name || "";
      city.value = locationData.find((c) =>
        c.types.includes("locality")
      )?.long_name || "";
      area.value = locationData.find((c) =>
        c.types.includes("sublocality")
      )?.long_name || "";
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
}, 200);
</script>

<!-- GOOGLE_MAPS_API_KEY="AIzaSyAmqmnMKDFq1urlcUYWXaMynmXTWIxbggg" -->

