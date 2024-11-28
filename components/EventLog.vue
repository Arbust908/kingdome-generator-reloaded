<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-medieval text-primary mb-4">Kingdom Events</h2>
    <div class="h-[600px] overflow-y-auto space-y-2 pr-4">
      <div
        v-for="event in events"
        :key="`${event.year}-${event.type}-${event.message}`"
        class="event-card"
        :class="`event-${event.type}`"
      >
        <div class="flex items-start justify-between">
          <span class="font-medieval text-primary">Year {{ event.year }}</span>
          <span class="text-sm capitalize text-gray-600">{{ event.type }}</span>
        </div>
        <p class="mt-2 whitespace-pre-line">{{ event.message }}</p>
        
        <!-- Enhanced details section -->
        <div v-if="event.details?.noble" class="mt-2 text-sm bg-gray-50 p-2 rounded">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <p><span class="font-semibold">Race:</span> {{ event.details.noble.race }}</p>
              <p><span class="font-semibold">Age:</span> {{ event.details.noble.age }}</p>
            </div>
            <div v-if="event.details.noble.specialFeatures?.length">
              <p class="font-semibold">Features:</p>
              <p class="text-xs">{{ event.details.noble.specialFeatures.join(', ') }}</p>
            </div>
          </div>
          
          <div v-if="event.details.noble.attributes" class="mt-2 grid grid-cols-3 gap-1 text-xs">
            <p><span class="font-semibold">STR:</span> {{ event.details.noble.attributes.strength }}</p>
            <p><span class="font-semibold">DEX:</span> {{ event.details.noble.attributes.dexterity }}</p>
            <p><span class="font-semibold">CON:</span> {{ event.details.noble.attributes.constitution }}</p>
            <p><span class="font-semibold">INT:</span> {{ event.details.noble.attributes.intelligence }}</p>
            <p><span class="font-semibold">WIS:</span> {{ event.details.noble.attributes.wisdom }}</p>
            <p><span class="font-semibold">CHA:</span> {{ event.details.noble.attributes.charisma }}</p>
          </div>
        </div>

        <!-- War stats section -->
        <div v-if="event.details?.warStats" class="mt-2 text-sm bg-gray-50 p-2 rounded">
          <div class="grid grid-cols-3 gap-2">
            <p><span class="font-semibold">Casualties:</span> {{ event.details.warStats.casualties }}</p>
            <p><span class="font-semibold">Victories:</span> {{ event.details.warStats.victories }}</p>
            <p><span class="font-semibold">Defeats:</span> {{ event.details.warStats.defeats }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GenerationEvent } from '~/types/kingdom'

defineProps<{
  events: GenerationEvent[]
}>()
</script>

<style scoped>
.event-card {
  @apply p-4 rounded-lg border border-gray-200 bg-white shadow-sm;
}

.event-death {
  @apply border-red-200 bg-red-50;
}

.event-ascension {
  @apply border-purple-200 bg-purple-50;
}

.event-war {
  @apply border-orange-200 bg-orange-50;
}

.event-monument {
  @apply border-blue-200 bg-blue-50;
}

.event-review {
  @apply border-green-200 bg-green-50;
}

.event-combat {
  @apply border-yellow-200 bg-yellow-50;
}

.event-evolution {
  @apply border-indigo-200 bg-indigo-50;
}
</style>
