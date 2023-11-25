<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  NaverMap,
  NaverMarker,
  NaverInfoWindow,
  NaverCircle,
  NaverEllipse,
  NaverGroundOverlay,
  NaverPolygon,
  NaverPolyline,
  NaverRectangle,
} from "~/src";

interface SNWE {
  south: number;
  north: number;
  west: number;
  east: number;
}

const map = ref<naver.maps.Map>(null as any);
const marker = ref();

const mapCenter = ref({
  lat: 37.5666103,
  lng: 126.9783882,
});

const ellipseBounds = ref<SNWE>({
  south: 37.566072,
  north: 37.5651,
  west: 126.978467,
  east: 126.977357,
});

const groundOverlayImg =
  "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQkrjYxSfSHeCEA7hkPy8e2JphDsfFHZVKqx-3t37E4XKr-AT7DML8IwtwY0TnZsUcQ";
const groundOverlayBound = ref<SNWE>({
  south: 37.565316,
  north: 37.565985,
  west: 126.978879,
  east: 126.979668,
});

const polygonPaths = ref<[number, number][]>([
  [126.9797895, 37.5670131],
  [126.979215, 37.5649555],
  [126.9766789, 37.5649082],
  [126.9789515, 37.5637645],
  [126.9785598, 37.5614914],
  [126.9804949, 37.5632666],
  [126.9827689, 37.5619065],
  [126.9818039, 37.5639213],
  [126.9837414, 37.5653719],
  [126.9811162, 37.5651081],
]);

const polylinePaths = ref<{ lat: number; lng: number }[]>([
  { lat: 37.570053, lng: 126.983005 },
  { lat: 37.566343, lng: 126.982671 },
]);

const rectangleBounds = ref<naver.maps.BoundsLiteral>({
  south: 37.564998,
  north: 37.566449,
  west: 126.973221,
  east: 126.975849,
});

const markerPos = ref({
  latitude: 37.566616443521745,
  longitude: 126.97837068565364,
});

function addSNWE(input: SNWE, diff: number): SNWE {
  return {
    south: input.south + diff,
    north: input.north + diff,
    west: input.west + diff,
    east: input.east + diff,
  };
}

const timer = ref<any>(null);
let timerFlag = false;

onMounted(() => {
  timer.value = setInterval(() => {
    if (timerFlag) {
      mapCenter.value.lng += 0.001;
      markerPos.value.longitude -= 0.001;
      markerPos.value.latitude -= 0.001;
      ellipseBounds.value = addSNWE(ellipseBounds.value, -0.001);
      polylinePaths.value = polylinePaths.value.map((item) => {
        item.lng -= 0.001;
        item.lat -= 0.001;
        return item;
      });
      polygonPaths.value = polygonPaths.value.map((item) => {
        item[0] -= 0.001;
        item[1] -= 0.001;
        return item;
      });
    } else {
      mapCenter.value.lng -= 0.001;
      markerPos.value.longitude += 0.001;
      markerPos.value.latitude += 0.001;
      ellipseBounds.value = addSNWE(ellipseBounds.value, 0.001);
      polylinePaths.value = polylinePaths.value.map((item) => {
        item.lng += 0.001;
        item.lat += 0.001;
        return item;
      });
      polygonPaths.value = polygonPaths.value.map((item) => {
        item[0] += 0.001;
        item[1] += 0.001;
        return item;
      });
    }
    timerFlag = !timerFlag;
    console.log(map.value.getCenter());
  }, 1000);
});
onBeforeUnmount(() => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
});
</script>

<template>
  <RouterLink to="/test">gogo</RouterLink>

  <NaverMap
    style="width: 90vw; height: 80vh"
    @onLoad="(obj) => (map = obj)"
    :latitude="mapCenter.lat"
    :longitude="mapCenter.lng"
  >
    <NaverMarker
      :latitude="markerPos.latitude"
      :longitude="markerPos.longitude"
      @on-load="marker = $event"
    />
    <NaverInfoWindow
      :marker="marker"
      :latitude="markerPos.latitude"
      :longitude="markerPos.longitude"
      :open="true"
    >
      Hello, Infowindow!
    </NaverInfoWindow>

    <NaverCircle
      :latitude="markerPos.latitude"
      :longitude="markerPos.longitude"
    />

    <NaverEllipse :bounds="ellipseBounds" />

    <NaverGroundOverlay :url="groundOverlayImg" :bounds="groundOverlayBound" />

    <NaverPolygon :paths="polygonPaths" />

    <NaverPolyline :path="polylinePaths" />

    <NaverRectangle :bounds="rectangleBounds" />
  </NaverMap>
</template>

<style scoped></style>
