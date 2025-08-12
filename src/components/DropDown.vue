<script setup>
import { ref } from "vue";

const props = defineProps(["placeholder"]);

const dropdownMenuClassName = ref(
    "absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown overflow-hidden invisible opacity-0 scale-95 transform transition-all duration-250 ease-in-out z-10"
);

function handleClickTrigger() {
    dropdownMenuClassName.value =
        "absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown overflow-hidden opacity-100 scale-100 rotate-icon transform transition-all duration-250 ease-in-out z-10";
}
function handleBlurTrigger() {
    dropdownMenuClassName.value =
        "absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown overflow-hidden invisible opacity-0 scale-95 transform transition-all duration-250 ease-in-out z-10";
}
function fun() {
    const dropdownContainer = document.getElementById("dropdown-container");
    const dropdownTrigger = document.getElementById("dropdown-trigger");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const selectedValue = document.getElementById("selected-value");
    const chevronIcon = dropdownTrigger.querySelector("i");
    const options = document.querySelectorAll(".dropdown-option");

    // 切换下拉菜单显示状态
    function toggleDropdown() {
        const isVisible = !dropdownMenu.classList.contains("invisible");

        if (isVisible) {
            // 隐藏下拉菜单
            dropdownMenu.classList.add("invisible", "opacity-0", "scale-95");
            dropdownMenu.classList.remove("opacity-100", "scale-100");
            chevronIcon.classList.remove("rotate-icon");
            dropdownTrigger.classList.remove("shadow-dropdown-hover");
        } else {
            // 显示下拉菜单
            dropdownMenu.classList.remove("invisible", "opacity-0", "scale-95");
            dropdownMenu.classList.add("opacity-100", "scale-100");
            chevronIcon.classList.add("rotate-icon");
            dropdownTrigger.classList.add("shadow-dropdown-hover");
        }
    }

    // 选择下拉选项
    options.forEach((option) => {
        option.addEventListener("click", () => {
            const optionText = option.querySelector("span").textContent;
            selectedValue.textContent = optionText;
            toggleDropdown();
        });
    });

    // 点击触发器切换下拉菜单
    dropdownTrigger.addEventListener("click", toggleDropdown);

    // 点击外部关闭下拉菜单
    document.addEventListener("click", (e) => {
        if (
            !dropdownContainer.contains(e.target) &&
            !dropdownMenu.classList.contains("invisible")
        ) {
            toggleDropdown();
        }
    });

    // 键盘事件支持
    document.addEventListener("keydown", (e) => {
        if (
            e.key === "Escape" &&
            !dropdownMenu.classList.contains("invisible")
        ) {
            toggleDropdown();
        }
    });
}
</script>

<template>
    <div class="relative dropdown-container">
        <!-- 下拉触发器 -->
        <input
            type="text"
            class="dropdown-trigger w-full bg-white border border-transparent rounded-lg px-4 py-3 cursor-pointer hover:border-[#4a90e2] focus:outline-none focus:ring-2 focus:ring-[#4a90e2]/30 focus:border-[#4a90e2] transition-all duration-200 ease-in-out"
            :placeholder="props.placeholder"
            @click="handleClickTrigger"
            @blur="handleBlurTrigger"
        />

        <!-- 下拉菜单 -->
        <div id="dropdown-menu" :class="dropdownMenuClassName">
            <ul class="divide-y divide-neutral-100">
                <li>
                    <button
                        class="dropdown-option w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors duration-150 flex items-center"
                    >
                        <i class="fa fa-user-circle text-primary mr-3"></i>
                        <span>个人账号</span>
                    </button>
                </li>
                <li>
                    <button
                        class="dropdown-option w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors duration-150 flex items-center"
                    >
                        <i class="fa fa-briefcase text-primary mr-3"></i>
                        <span>企业账号</span>
                    </button>
                </li>
                <li>
                    <button
                        class="dropdown-option w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors duration-150 flex items-center"
                    >
                        <i class="fa fa-graduation-cap text-primary mr-3"></i>
                        <span>学生账号</span>
                    </button>
                </li>
                <li>
                    <button
                        class="dropdown-option w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors duration-150 flex items-center"
                    >
                        <i class="fa fa-institution text-primary mr-3"></i>
                        <span>政府机构</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped></style>
