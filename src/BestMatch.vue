<script setup>
import { ref, inject } from "vue";
import pals from "./pals.json";
import DropDown from "./components/DropDown.vue";

const selectedBasePals = ref([]);

function handleSelectBasePal(item) {
    if (selectedBasePals.value.some(el => el.palNameEN === item.palNameEN)) {
        selectedBasePals.value = selectedBasePals.value.filter(
            el => el.palNameEN !== item.palNameEN
        );
    } else {
        selectedBasePals.value.push(item);
    }
}

function filterFn(item, searchValue) {
    return (
        item.palNameCN.includes(searchValue) ||
        item.palNameEN.includes(searchValue)
    );
}

const targetPalDropDown = ref(null);

const targetPal = ref({});

function handleSelectTargetPal(item) {
    targetPal.value = item;
    targetPalDropDown.value.changeSearchValue(
        item.palNameCN + "(" + item.fecundity + ")"
    );
}

const toast = inject("toast");

function handleCalculate() {
    if (selectedBasePals.value.length === 0) {
        toast.value.show("请选择已拥有的帕鲁");
        return;
    }
    if (!targetPal.value.palNameEN) {
        toast.value.show("请选择要繁殖的帕鲁");
        return;
    }
    // 帕鲁繁殖公式：(父fecundity + 母fecundity + 1) / 2 为目标 fecundity
    // 如果计算值有多个最接近的目标值，取fecundity大的
    const targetFecundity = targetPal.value.fecundity;
    const targetPalIndex = pals.findIndex(
        el => el.palNameEN === targetPal.value.palNameEN
    );

    // 1. 计算已经选择的帕鲁中没有没满足的
    for (let i = 0; i < selectedBasePals.value.length; ++i) {
        let flag = null;
        for (let j = i; j < selectedBasePals.value.length; ++j) {
            const res = generate(
                selectedBasePals.value[i],
                selectedBasePals.value[j]
            );
            if (res.palNameEN === targetPal.value.palNameEN) {
                flag = j;
                break;
            }
        }
        if (flag !== null) {
            toast.value.show(
                selectedBasePals.value[i].palNameCN +
                    "和" +
                    selectedBasePals.value[flag].palNameCN
            );

            return;
        }
    }
    toast.value.show("当前已选择的帕鲁无法繁殖出目标帕鲁");
}

function generate(a, b) {
    const targetFecundity = (a.fecundity + b.fecundity + 1) / 2;
    // 使用二分查找
    let left = 0;
    let right = pals.length - 1;
    let result = null;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midFecundity = pals[mid].fecundity;

        if (midFecundity === targetFecundity) {
            result = mid;
            break;
        } else if (midFecundity < targetFecundity) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (result !== null) {
        // 精准找到目标
        return pals[result];
    } else {
        // 找到最接近的目标值
        if (left >= pals.length) {
            // 取 right 和左右的值
            let diff = Math.abs(pals[right].fecundity - targetFecundity);
            let minIndex = right;

            if (right > 0) {
                const diffLeft = Math.abs(
                    pals[minIndex - 1].fecundity - targetFecundity
                );
                if (diffLeft < diff) {
                    minIndex = minIndex - 1;
                    diff = diffLeft;
                } else if (diffLeft === diff) {
                    if (
                        pals[minIndex - 1].fecundity > pals[minIndex].fecundity
                    ) {
                        minIndex = minIndex - 1;
                        diff = diffLeft;
                    } else if (
                        pals[minIndex - 1].fecundity ===
                        pals[minIndex].fecundity
                    ) {
                        toast.value.show(
                            "找到多个最接近的目标值，取fecundity大的"
                        );
                    }
                }
            }
            if (right < pals.length - 1) {
                const diffRight = Math.abs(
                    pals[right + 1].fecundity - targetFecundity
                );
                if (diffRight < diff) {
                    minIndex = right + 1;
                    diff = diffRight;
                } else if (diffRight === diff) {
                    if (
                        pals[minIndex + 1].fecundity > pals[minIndex].fecundity
                    ) {
                        minIndex = right + 1;
                        diff = diffRight;
                    } else if (
                        pals[minIndex + 1].fecundity ===
                        pals[minIndex].fecundity
                    ) {
                        toast.value.show(
                            "找到多个最接近的目标值，取fecundity大的"
                        );
                    }
                }
            }
            return pals[minIndex];
        } else if (right < 0) {
            // 取 left 和左右的值
            let diff = Math.abs(pals[left].fecundity - targetFecundity);
            let minIndex = left;
            if (left > 0) {
                const diffLeft = Math.abs(
                    pals[minIndex - 1].fecundity - targetFecundity
                );
                if (diffLeft < diff) {
                    minIndex = minIndex - 1;
                    diff = diffLeft;
                } else if (diffLeft === diff) {
                    if (
                        pals[minIndex - 1].fecundity > pals[minIndex].fecundity
                    ) {
                        minIndex = minIndex - 1;
                        diff = diffLeft;
                    } else if (
                        pals[minIndex - 1].fecundity ===
                        pals[minIndex].fecundity
                    ) {
                        toast.value.show(
                            "找到多个最接近的目标值，取fecundity大的"
                        );
                    }
                }
            }
            if (left < pals.length - 1) {
                const diffRight = Math.abs(
                    pals[left + 1].fecundity - targetFecundity
                );
                if (diffRight < diff) {
                    minIndex = left + 1;
                    diff = diffRight;
                } else if (diffRight === diff) {
                    if (
                        pals[minIndex + 1].fecundity > pals[minIndex].fecundity
                    ) {
                        minIndex = left + 1;
                        diff = diffRight;
                    } else if (
                        pals[minIndex + 1].fecundity ===
                        pals[minIndex].fecundity
                    ) {
                        toast.value.show(
                            "找到多个最接近的目标值，取fecundity大的"
                        );
                    }
                }
            }
            return pals[minIndex];
        } else {
            // 取 left 和 right 的值
            const diff = Math.abs(pals[left].fecundity - targetFecundity);
            const diff2 = Math.abs(pals[right].fecundity - targetFecundity);
            if (diff < diff2) {
                return pals[left];
            } else if (diff > diff2) {
                return pals[right];
            } else {
                if (pals[left].fecundity > pals[right].fecundity) {
                    return pals[left];
                } else if (pals[left].fecundity < pals[right].fecundity) {
                    return pals[right];
                } else {
                    toast.value.show("找到多个最接近的目标值，取fecundity大的");
                }
            }
        }
    }
}
</script>

<template>
    <div class="best-match-wrap">
        <div class="flex justify-around items-center">
            <DropDown
                class="w-64"
                :list="pals"
                :filter="filterFn"
                placeholder="请选择已拥有的帕鲁"
            >
                <template #default="{ item }">
                    <div
                        class="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 cursor-pointer"
                        @click="handleSelectBasePal(item)"
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
                                v-if="
                                    selectedBasePals.some(
                                        el => el.palNameEN === item.palNameEN
                                    )
                                "
                                class="fa fa-check text-green-500"
                            ></i>
                        </Transition>
                    </div>
                </template>
            </DropDown>
            <DropDown
                ref="targetPalDropDown"
                class="w-64"
                :list="pals"
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
                                v-if="targetPal.palNameEN === item.palNameEN"
                                class="fa fa-check text-green-500"
                            ></i>
                        </Transition>
                    </div>
                </template>
            </DropDown>
            <button
                class="p-3 bg-white rounded-lg cursor-pointer hover:bg-[#eee] active:bg-[#ddd]"
                @click="handleCalculate"
            >
                开始计算
            </button>
        </div>
        <!-- 已拥有的帕鲁 -->
        <div class="mt-4 text-white">
            <span>已拥有的帕鲁：</span>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
            <TransitionGroup
                name="pal-item"
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 scale-90 translate-y-2"
                leave-to-class="opacity-0 scale-90 translate-y-2"
            >
                <div
                    v-for="item in selectedBasePals"
                    :key="item.palNameEN"
                    class="w-40 flex items-center justify-center bg-white border border-transparent rounded-lg p-2"
                >
                    <img
                        class="w-10 h-10 mr-4 rounded-full"
                        :src="`/${item.palNameEN}.png`"
                    />

                    <span>{{ item.palNameCN }}({{ item.fecundity }})</span>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<style scoped></style>
