<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  values: number[];
}>();

const labels = ['F1', 'F2', 'E1', 'E2', 'S1', 'S2', 'A1', 'A2'];
const center = 120;
const radius = 82;

function point(index: number, value = 3): string {
  const angle = -Math.PI / 2 + (index / labels.length) * Math.PI * 2;
  const distance = radius * (value / 3);
  const x = center + Math.cos(angle) * distance;
  const y = center + Math.sin(angle) * distance;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

const rings = computed(() => [1, 2, 3].map((level) => labels.map((_, index) => point(index, level)).join(' ')));
const areaPoints = computed(() => labels.map((_, index) => point(index, props.values[index] ?? 1)).join(' '));
</script>

<template>
  <svg class="radar" viewBox="0 0 240 240" aria-label="八维球迷 DNA 雷达图">
    <polygon v-for="ring in rings" :key="ring" :points="ring" class="ring" />
    <line v-for="(_, index) in labels" :key="index" :x1="center" :y1="center" :x2="point(index).split(',')[0]" :y2="point(index).split(',')[1]" class="axis" />
    <polygon :points="areaPoints" class="area" />
    <circle v-for="(_, index) in labels" :key="`dot-${index}`" :cx="point(index, values[index] ?? 1).split(',')[0]" :cy="point(index, values[index] ?? 1).split(',')[1]" r="4" class="dot" />
    <text v-for="(label, index) in labels" :key="label" :x="point(index, 3.34).split(',')[0]" :y="point(index, 3.34).split(',')[1]" class="label">
      {{ label }}
    </text>
  </svg>
</template>

<style scoped>
.radar {
  display: block;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

.ring,
.axis {
  fill: none;
  stroke: #d6e7ff;
  stroke-width: 1.5;
}

.area {
  fill: rgba(0, 130, 255, 0.24);
  stroke: #0082ff;
  stroke-width: 3;
}

.dot {
  fill: #0082ff;
  stroke: #ffffff;
  stroke-width: 2;
}

.label {
  fill: #667085;
  font-size: 12px;
  font-weight: 700;
  dominant-baseline: middle;
  text-anchor: middle;
}
</style>
