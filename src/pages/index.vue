<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const CounterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(CounterStore)
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-gray-800 font-semibold text-2xl mb-4">
      Home Page
    </h2>
    <p class="text-gray-600 leading-relaxed mb-4">
      Welcome to the Vue Template project!
    </p>
    <p class="text-gray-600 leading-relaxed mb-4">
      This is a template project using:
    </p>
    <ul class="text-gray-600 leading-relaxed ml-6 mb-8 list-disc">
      <li>Vue 3</li>
      <li>TypeScript</li>
      <li>Vite</li>
      <li>Pinia (State Management)</li>
      <li>Vue Router (File-based Routing)</li>
    </ul>

    <div class="bg-gray-50 p-6 rounded-lg mt-8">
      <h3 class="text-gray-800 font-medium text-lg mb-4">
        Counter Example (Pinia)
      </h3>
      <p class="text-gray-600 mb-2">
        Count: {{ count }}
      </p>
      <p class="text-gray-600 mb-4">
        Double Count: {{ doubleCount }}
      </p>
      <div class="flex gap-4 mt-4">
        <button class="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition-colors" @click="CounterStore.increment">
          Increment
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition-colors" @click="CounterStore.decrement">
          Decrement
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition-colors" @click="CounterStore.reset">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
