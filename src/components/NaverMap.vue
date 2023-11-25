<script setup lang="ts">
import { onMounted, onUnmounted, ref, useAttrs, toRefs, watch } from "vue";
import { mapInstance, mapCallbackList, mapIsLoaded } from "@/stores";
import { addEventMap } from "@/composables/useEvent";
import { useSetupScript } from "@/composables/useSetup";
import { LAYER_TABLE } from "@/constants/tables";
import { UI_EVENT_MAP } from "@/constants/events";

import type { Layers } from "@/types";

const emits = defineEmits([...UI_EVENT_MAP, "onLoad"]);
const props = defineProps<{
  mapOptions?: naver.maps.MapOptions;
  initLayers?: Layers[];
  latitude?: number;
  longitude?: number;
}>();

const attrs = useAttrs();
const mapElement = ref<HTMLDivElement>();
const { initLayers, mapOptions, latitude, longitude } = toRefs(props);

/** Get map options */
const useMapSettings = (): naver.maps.MapOptions => {
  const options = mapOptions?.value ?? {};
  const layers = initLayers?.value ?? [];

  const overlayType = layers.map((layer) => LAYER_TABLE[layer]).join(".");

  if (latitude!!.value && longitude!!.value) {
    options.center = new window.naver.maps.LatLng(
      latitude!!.value,
      longitude!!.value
    );
  }

  return {
    ...options,
    mapTypes: new window.naver.maps.MapTypeRegistry({
      normal: window.naver.maps.NaverStyleMapTypeOptions.getNormalMap({
        overlayType: overlayType,
      }),
      satellite: window.naver.maps.NaverStyleMapTypeOptions.getSatelliteMap({
        overlayType: overlayType,
      }),
      hybrid: window.naver.maps.NaverStyleMapTypeOptions.getHybridMap({
        overlayType: overlayType,
      }),
      terrain: window.naver.maps.NaverStyleMapTypeOptions.getTerrainMap({
        overlayType: overlayType,
      }),
    }),
  };
};

/** Setup MapInstance */
const useInitMap = () => {
  mapInstance.value = new window.naver.maps.Map(
    mapElement.value!,
    useMapSettings()
  );
  addEventMap(emits, mapInstance.value); // add event
  mapIsLoaded.value = true;
  mapCallbackList.value.map((item) => item(mapInstance.value!));
  mapCallbackList.value = [];

  emits("onLoad", mapInstance.value);
};

onMounted(() => {
  window.naver ? useInitMap() : useSetupScript(useInitMap);
});
onUnmounted(() => {
  mapInstance.value?.destroy();
  mapInstance.value = undefined;
  mapIsLoaded.value = false;
});

watch([latitude!!, longitude!!], ([latitude, longitude]) => {
  if (latitude && longitude) {
    mapInstance?.value?.setCenter(
      new window.naver.maps.LatLng(latitude, longitude)
    );
  }
});
</script>

<template>
  <div ref="mapElement" v-bind="attrs">
    <slot></slot>
  </div>
</template>
