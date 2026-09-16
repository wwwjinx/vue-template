<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const CounterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(CounterStore)
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <h2 class="text-2xl text-gray-800 font-semibold mb-4">
      Home Page
    </h2>
    <p class="text-gray-600 leading-relaxed mb-4">
      Welcome to the Vue Template project!
    </p>
    <p class="text-gray-600 leading-relaxed mb-4">
      This is a template project using:
    </p>
    <ul class="text-gray-600 leading-relaxed mb-8 ml-6 list-disc">
      <li>Vue 3</li>
      <li>TypeScript</li>
      <li>Vite</li>
      <li>Pinia (State Management)</li>
      <li>Vue Router (File-based Routing)</li>
    </ul>

    <div class="mt-8 p-6 rounded-lg bg-gray-50">
      <h3 class="text-lg text-gray-800 font-medium mb-4">
        Counter Example (Pinia)
      </h3>
      <p class="text-gray-600 mb-2">
        Count: {{ count }}
      </p>
      <p class="text-gray-600 mb-4">
        Double Count: {{ doubleCount }}
      </p>
      <div class="mt-4 flex gap-4">
        <button class="px-4 py-2 border border-gray-300 rounded-md bg-white transition-colors hover:bg-gray-100" @click="CounterStore.increment">
          Increment
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-md bg-white transition-colors hover:bg-gray-100" @click="CounterStore.decrement">
          Decrement
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-md bg-white transition-colors hover:bg-gray-100" @click="CounterStore.reset">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
