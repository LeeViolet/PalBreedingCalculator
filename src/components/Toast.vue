<script setup>
import { ref } from "vue";

const showToast = ref(false);
const toastMessage = ref("");

let toastTimer = null;

defineExpose({
    show(msg) {
        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toastMessage.value = msg;
        showToast.value = true;
        toastTimer = setTimeout(() => {
            showToast.value = false;
        }, 3000);
    },
});
</script>

<template>
    <Transition
        name="toast"
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 translate-y-4"
        leave-to-class="opacity-0 translate-y-4"
    >
        <div
            v-if="showToast"
            class="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
            {{ toastMessage }}
        </div>
    </Transition>
</template>

<style scoped></style>
