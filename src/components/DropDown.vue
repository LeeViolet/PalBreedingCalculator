<script setup>
import { ref } from "vue";

defineExpose({
    changeSearchValue(value) {
        searchValue.value = value;
    },
});

const props = defineProps(["placeholder", "list", "filter"]);

const emptyShow = ref(false);

const dropdownMenuClassName = ref(
    "absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown overflow-hidden invisible opacity-0 scale-95 transform transition-all duration-250 ease-in-out z-10"
);

const searchValue = ref("");
const filteredList = ref(props.list);

function handleSearch() {
    filteredList.value = props.list.filter(item =>
        props.filter(item, searchValue.value)
    );
}

function handleClickTrigger() {
    emptyShow.value = true;

    dropdownMenuClassName.value =
        "absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown overflow-hidden opacity-100 scale-100 rotate-icon transform transition-all duration-250 ease-in-out z-10";
}
function handleBlurTrigger() {
    searchValue.value = "";
    emptyShow.value = false;

    dropdownMenuClassName.value =
        "absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown overflow-hidden invisible opacity-0 scale-95 transform transition-all duration-250 ease-in-out z-10";

    setTimeout(() => {
        filteredList.value = props.list;
    }, 300);
}
</script>

<template>
    <div class="relative dropdown-container">
        <!-- 下拉触发器 -->
        <input
            v-model="searchValue"
            type="text"
            class="dropdown-trigger placeholder:text-gray-400 w-full bg-white border border-transparent rounded-lg px-4 py-3 cursor-pointer hover:border-[#4a90e2] focus:outline-none focus:ring-2 focus:ring-[#4a90e2]/30 focus:border-[#4a90e2] transition-all duration-200 ease-in-out"
            :placeholder="props.placeholder"
            @click="handleClickTrigger"
            @blur="handleBlurTrigger"
            @input="handleSearch"
        />

        <!-- 下拉菜单 -->
        <div id="dropdown-menu" :class="dropdownMenuClassName">
            <ul
                v-if="filteredList.length"
                class="divide-y divide-neutral-100 overflow-y-auto max-h-60"
            >
                <li v-for="item in filteredList">
                    <slot :item="item" />
                </li>
            </ul>
            <div
                v-else-if="emptyShow"
                class="absolute bg-white top-full left-0 right-0 rounded-lg p-3 text-center text-gray-400"
            >
                暂无数据
            </div>
        </div>
    </div>
</template>

<style scoped></style>
