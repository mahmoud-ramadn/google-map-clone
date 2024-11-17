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
          <Marker :options="{position: center}" />
        </GoogleMap>

        <div class="absolute top-0 start-0 w-full z-10 flex justify-center p-6">
          <input
            type="text"
            placeholder="Search .."
            class="border h-10 rounded-xl border-gray-200 px-6 outline-0 shadow-md text-sm"
            @input="onInputChange"
          />
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
import {GoogleMap, Marker} from "vue3-google-map";
import {debounce} from "lodash-es";




const mapRef = ref<any>(null);

const center = ref({lat: 31.4175, lng: 31.8144});

console.log(mapRef.value);


// emit("change", center.value);

const onMapClick = (value: any) => {
  if (!value) return;
  const lat = value?.latLng?.lat();
  const lng = value?.latLng?.lng();

  console.log(value?.latLng?.lat());
  

  center.value = {lat, lng};

};

let geocoder: google.maps.Geocoder | null = null;

// Watch for Map Initialization





watch(
  () => mapRef.value?.ready,
  (value) => {
    if (!value) return;
    geocoder = new google.maps.Geocoder();
  },
  {immediate: true}
);

// Input Change Handler
const onInputChange = debounce(async (e: Event) => {
  try {
    const searchVal = (e.target as HTMLInputElement)?.value;
    if (!searchVal || searchVal.length < 3) return;

    if (!geocoder) {
      return;

    }
    
    const results = await geocoder.geocode({ address: searchVal });

    console.log(results);
    

    if (results.results.length) {
      const location = results.results[0].geometry.location;
      center.value = {lat: location.lat(), lng: location.lng()};
    }
  } catch (err) {
    console.error("Geocoding error:", err);
  }
}, 200);

</script>

<!-- GOOGLE_MAPS_API_KEY="AIzaSyAmqmnMKDFq1urlcUYWXaMynmXTWIxbggg" -->

