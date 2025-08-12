<script setup>
import { ref, provide } from "vue";

import pals from "./pals.json";
import BestMatch from "./BestMatch.vue";
import Toast from "./components/Toast.vue";

const toastRef = ref(null);
provide("toast", toastRef);
</script>

<template>
    <div class="bg-sky-900 min-h-screen">
        <BestMatch />
        <Toast ref="toastRef" />
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
