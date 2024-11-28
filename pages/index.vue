<template>
  <div class="min-h-screen bg-parchment p-4 md:p-8" style="background-image: url('/background.jpg'); background-size: cover;">
    <div class="max-w-7xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-medieval text-primary mb-2">
          Kingdom History Generator
        </h1>
        <p class="text-gray-700 bg-white/80 inline-block px-4 py-2 rounded-lg">Generate the history of your medieval realm</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Configuration Panel -->
        <div class="bg-white/90 rounded-lg shadow-xl p-6">
          <h2 class="text-2xl font-medieval text-primary mb-6">Kingdom Configuration</h2>
          
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2">Years to Simulate</label>
                <input 
                  v-model="config.yearsToSimulate" 
                  type="number"
                  class="input-field"
                  :disabled="isGenerating"
                >
              </div>
              
              <div>
                <label class="block text-sm font-semibold mb-2">Review Period (Years)</label>
                <input 
                  v-model="config.nobleReviewPeriod" 
                  type="number"
                  class="input-field"
                  :disabled="isGenerating"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Noble Houses</label>
              <input 
                v-model="nobleHousesInput" 
                type="text"
                class="input-field"
                :disabled="isGenerating"
                placeholder="Separate house names with commas"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Other Kingdoms</label>
              <input 
                v-model="otherKingdomsInput" 
                type="text"
                class="input-field"
                :disabled="isGenerating"
                placeholder="Separate kingdom names with commas"
              >
            </div>

            <div>
              <label class="block text-sm font-semibold mb-4">Settings</label>
              <div class="grid grid-cols-2 gap-4">
                <label class="flex items-center space-x-2">
                  <input 
                    v-model="config.allowUsurping"
                    type="checkbox"
                    class="rounded text-primary focus:ring-primary"
                    :disabled="isGenerating"
                  >
                  <span>Allow Usurping</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input 
                    v-model="config.inlineMonuments"
                    type="checkbox"
                    class="rounded text-primary focus:ring-primary"
                    :disabled="isGenerating"
                  >
                  <span>Show Monuments</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input 
                    v-model="config.inlineWars"
                    type="checkbox"
                    class="rounded text-primary focus:ring-primary"
                    :disabled="isGenerating"
                  >
                  <span>Show Wars</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input 
                    v-model="config.inlineDeaths"
                    type="checkbox"
                    class="rounded text-primary focus:ring-primary"
                    :disabled="isGenerating"
                  >
                  <span>Show Deaths</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input 
                    v-model="config.inlineAscensions"
                    type="checkbox"
                    class="rounded text-primary focus:ring-primary"
                    :disabled="isGenerating"
                  >
                  <span>Show Ascensions</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input 
                    v-model="config.inlinePower"
                    type="checkbox"
                    class="rounded text-primary focus:ring-primary"
                    :disabled="isGenerating"
                  >
                  <span>Show Power</span>
                </label>
              </div>
            </div>

            <button 
              @click="generateKingdom"
              class="btn-primary w-full"
              :disabled="isGenerating"
            >
              <span v-if="isGenerating">
                Generating Year {{ currentYear }}...
              </span>
              <span v-else>
                Generate Kingdom History
              </span>
            </button>
          </div>
        </div>

        <!-- Event Log -->
        <div class="bg-white/90 rounded-lg shadow-xl p-6">
          <EventLog :events="events" />
        </div>
      </div>

      <!-- Kingdom Summary -->
      <div v-if="kingdom && !isGenerating" class="mt-8 bg-white/90 rounded-lg shadow-xl p-6">
        <h2 class="text-2xl font-medieval text-primary mb-6">Kingdom Summary</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-medieval text-primary mb-4">Current Ruler</h3>
            <div v-if="kingdom.ruler" class="space-y-2">
              <p>
                <span class="font-semibold">Name:</span> 
                {{ kingdom.ruler.title }} {{ kingdom.ruler.name }} {{ kingdom.ruler.sobriquet }}
              </p>
              <p>
                <span class="font-semibold">House:</span> 
                {{ kingdom.ruler.nobleHouse.name }}
              </p>
              <p>
                <span class="font-semibold">Race:</span> 
                {{ kingdom.ruler.race.name }}
              </p>
              <p>
                <span class="font-semibold">Age:</span> 
                {{ kingdom.ruler.age }}
              </p>
              <div class="mt-2">
                <span class="font-semibold">Attributes:</span>
                <div class="grid grid-cols-2 gap-x-4 text-sm mt-1">
                  <p>STR: {{ kingdom.ruler.attributes.strength.toFixed(1) }}</p>
                  <p>DEX: {{ kingdom.ruler.attributes.dexterity.toFixed(1) }}</p>
                  <p>CON: {{ kingdom.ruler.attributes.constitution.toFixed(1) }}</p>
                  <p>INT: {{ kingdom.ruler.attributes.intelligence.toFixed(1) }}</p>
                  <p>WIS: {{ kingdom.ruler.attributes.wisdom.toFixed(1) }}</p>
                  <p>CHA: {{ kingdom.ruler.attributes.charisma.toFixed(1) }}</p>
                </div>
              </div>
              <div class="mt-2">
                <span class="font-semibold">Special Features:</span>
                <p class="text-sm mt-1">{{ kingdom.ruler.specialFeatures.map(f => f.name).join(', ') }}</p>
              </div>
              <p v-if="config.inlinePower">
                <span class="font-semibold">Power:</span> 
                {{ kingdom.ruler.power.toFixed(1) }}
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-medieval text-primary mb-4">Noble Houses</h3>
            <div class="space-y-4">
              <div 
                v-for="house in kingdom.nobleHouses" 
                :key="house.name"
                class="space-y-2"
              >
                <div class="flex justify-between items-center font-semibold">
                  <span>House {{ house.name }}</span>
                  <span class="text-gray-600">
                    {{ house.livingNobles.length }} nobles
                    <span v-if="config.inlinePower">
                      (Power: {{ house.power.toFixed(1) }})
                    </span>
                  </span>
                </div>
                <div class="text-sm text-gray-600">
                  Race Distribution:
                  {{ Object.entries(getRaceDistribution(house)).map(([race, count]) => `${race}: ${count}`).join(', ') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NobleHouse } from '~/types/kingdom'

const { kingdom, events, isGenerating, currentYear, config, generateKingdom } = useKingdom()

// Computed properties for input handling
const nobleHousesInput = computed({
  get: () => config.value.nobleHouseNames.join(','),
  set: (value: string) => {
    config.value.nobleHouseNames = value.split(',').map(name => name.trim()).filter(Boolean)
  }
})

const otherKingdomsInput = computed({
  get: () => config.value.otherKingdoms.join(','),
  set: (value: string) => {
    config.value.otherKingdoms = value.split(',').map(name => name.trim()).filter(Boolean)
  }
})

const getRaceDistribution = (house: NobleHouse) => {
  return house.livingNobles.reduce((acc, noble) => {
    acc[noble.race.name] = (acc[noble.race.name] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}
</script>
