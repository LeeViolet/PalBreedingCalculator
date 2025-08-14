<script setup>
import { ref, inject, computed } from "vue";
import pals from "./data/pals.js";
import combos from "./data/combos.js";
import palCombos from "./data/palCombos.js";
import DropDown from "./components/DropDown.vue";

const toast = inject("toast");

const palList = Object.values(pals);

const selectedBasePals = ref([]);

function filterFn(item, searchValue) {
    return (
        item.palNameCN.includes(searchValue) ||
        item.palNameEN.includes(searchValue)
    );
}

const targetPalDropDown = ref(null);

const targetPal = ref("");

function handleSelectTargetPal(item) {
    targetPal.value = item.palNameEN;

    targetPalDropDown.value.changeSearchValue(item.palNameCN);
}
function handleSelectBasePal(palNameEN) {
    const i = selectedBasePals.value.indexOf(palNameEN);
    if (i === -1) {
        selectedBasePals.value.push(palNameEN);
    } else {
        selectedBasePals.value.splice(i, 1);
    }
}

const listType = ref("all");
const showedPalList = computed(() => {
    if (listType.value === "all") {
        return palList;
    } else if (listType.value === "owned") {
        return palList.filter((item) =>
            selectedBasePals.value.includes(item.palNameEN)
        );
    } else if (listType.value === "unowned") {
        return palList.filter(
            (item) => !selectedBasePals.value.includes(item.palNameEN)
        );
    }
});
function handleChangeShowList(type) {
    listType.value = type;
}

function handleCalculate() {
    if (selectedBasePals.value.length < 2) {
        toast.value.show("请选择至少2个帕鲁");
        return;
    }
    if (!targetPal.value) {
        toast.value.show("请选择要繁殖的帕鲁");
        return;
    }
    /**
     * 1. 查找目标帕鲁的配种公式
     *
     */
    const targetCombos = combos[targetPal.value];
    for (const c of targetCombos) {
        // 直接匹配
        const directRes = [];
        for (const p of selectedBasePals.value) {
            if (p === c.a) {
                directRes.push(p);
                if (directRes.length === 2) break;
            }
            if (p === c.b) {
                directRes.push(p);
                if (directRes.length === 2) break;
            }
        }
        if (directRes.length === 2) {
            // 可以直接繁殖
            console.log(directRes);
            break;
        }
    }
}
</script>

<template>
    <div class="best-match-wrap">
        <div class="p-4 flex items-center">
            <DropDown
                ref="targetPalDropDown"
                class="w-64"
                :list="palList"
                :filter="filterFn"
                placeholder="请选择要繁殖的帕鲁"
            >
                <template #default="{ item }">
                    <div
                        class="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 cursor-pointer"
                        @click="handleSelectTargetPal(item)"
                    >
                        <div class="flex items-center">
                            <img
                                class="w-10 h-10 mr-4 rounded-full"
                                :src="`/${item.palNameEN}.png`"
                            />
                            <span>{{ item.palNameCN }}</span>
                        </div>
                        <Transition
                            name="check"
                            enter-active-class="transition-all duration-300 ease-out"
                            leave-active-class="transition-all duration-200 ease-in"
                            enter-from-class="opacity-0 scale-0"
                            leave-to-class="opacity-0 scale-0"
                        >
                            <i
                                v-if="targetPal === item.palNameEN"
                                class="fa fa-check text-green-500"
                            ></i>
                        </Transition>
                    </div>
                </template>
            </DropDown>
            <button
                class="ml-4 p-3 bg-white rounded-lg cursor-pointer hover:bg-[#eee] active:bg-[#ddd]"
                @click="handleCalculate"
            >
                开始计算
            </button>
        </div>
        <!-- 计算结果 -->

        <!-- 已拥有的帕鲁 -->
        <div class="p-4">
            <div>
                <span class="text-white">已拥有的帕鲁：</span>
                <button
                    class="ml-2 p-2 text-black bg-white rounded-lg cursor-pointer hover:bg-[#eee] active:bg-[#ddd]"
                    @click="handleChangeShowList('owned')"
                >
                    显示已拥有的帕鲁
                </button>

                <button
                    class="ml-2 p-2 text-black bg-white rounded-lg cursor-pointer hover:bg-[#eee] active:bg-[#ddd]"
                    @click="handleChangeShowList('unowned')"
                >
                    显示未拥有的帕鲁
                </button>
                <button
                    class="ml-2 p-2 text-black bg-white rounded-lg cursor-pointer hover:bg-[#eee] active:bg-[#ddd]"
                    @click="handleChangeShowList('all')"
                >
                    显示所有帕鲁
                </button>
            </div>
            <div class="mt-4 p-4 flex flex-wrap gap-2">
                <TransitionGroup name="list">
                    <div
                        v-for="item in showedPalList"
                        :key="item.palNameEN"
                        class="relative w-40 flex items-center bg-white border border-transparent rounded-lg p-2 cursor-pointer hover:bg-white-500"
                        @click="handleSelectBasePal(item.palNameEN)"
                    >
                        <img
                            class="w-10 h-10 mr-4 rounded-full"
                            :src="`/${item.palNameEN}.png`"
                        />
                        <span>{{ item.palNameCN }}</span>
                        <i
                            v-if="selectedBasePals.includes(item.palNameEN)"
                            class="absolute right-0 top-0 fa fa-check text-green-500"
                        ></i>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
