<template>
  <div v-if="showAlert" class="alert">
    <p>{{ messageAlert }}</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { alertStore } from '../store/alertStore'
const alert = alertStore()
const { messageAlert, showAlert } = storeToRefs(alert)
console.log(messageAlert)
</script>

<style scoped>

.alert {
  position: fixed;
  bottom: 15px; 
  right: 5px;
  z-index: 5;
  background-color: #ffb7be;
  border: 3px solid #f5c6cb;;
  border-radius: 5px;
  padding: 10px 20px;
  color: #721c24;
  font-size: 13px;
}

</style>
