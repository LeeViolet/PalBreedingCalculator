<script setup>
import { ref, provide } from "vue";

import pals from "./pals.json";
import BestMatch from "./BestMatch.vue";
import NormalPair from "./NormalPair.vue";
import Toast from "./components/Toast.vue";

const toastRef = ref(null);
provide("toast", toastRef);

const tabs = [NormalPair, BestMatch];
const tabIndex = ref(0);
const tab = NormalPair;
</script>

<template>
    <div class="bg-sky-900 min-h-screen">
        <div class="flex justify-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] items-center space-x-8">
            <div class="text-gray-200 px-8 py-6 transition-all duration-200 hover:bg-sky-800 cursor-pointer"
                :class="{ 'bg-sky-700': tabIndex === 0 }" @click="tabIndex = 0">普通匹配</div>
            <div class="text-gray-200 px-8 py-6 transition-all duration-200 hover:bg-sky-700 cursor-pointer"
                :class="{ 'bg-sky-700': tabIndex === 1 }" @click="tabIndex = 1">路线匹配</div>
        </div>
        <Transition name="check" enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0"
            leave-to-class="opacity-0">
            <component :is="tabs[tabIndex]"></component>
        </Transition>
        <Toast ref="toastRef" />
    </div>
</template>

<style scoped></style>
