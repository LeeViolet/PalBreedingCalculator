import rawPals from "./raw_pals.js";
import rawCombos from "./raw_combos.js";
import fs from "node:fs";

const rawPalKeys = Object.keys(rawPals);
const pals = {};
const combos = {};

function processPals() {
    const palList = JSON.parse(fs.readFileSync("../pals.json", "utf8"));
    for (const item of palList) {
        const rawIndex = rawPalKeys.indexOf(item.palNameEN);
        if (rawIndex === -1) continue;
        pals[item.palNameEN] = {
            ...item,
            index: rawPals[rawPalKeys[rawIndex]].ZukanIndex
        };
    }

    fs.writeFileSync("./pals.js", objectToJsFileContent(pals));
}

function processCombos() {
    const keys = Object.keys(rawCombos);

    const ks = Object.keys(pals);

    for (const k of ks) {
        const i = keys.indexOf(k.toLocaleLowerCase());
        if (i === -1) continue;
        const pal = rawCombos[keys[i]];
        const tmp = [];
        for (const item of pal) {
            const a = ks.find((el) => el.toLocaleLowerCase() === item.A);
            const b = ks.find((el) => el.toLocaleLowerCase() === item.B);
            if (!a || !b) continue;
            tmp.push({ a, b });
        }
        combos[k] = tmp;
    }
    // // 生成文件内容
    const fileContent = objectToJsFileContent(combos);

    // // 写入文件
    fs.writeFileSync("./combos.js", fileContent, "utf8");
}

function processPalCombos() {
    const palCombos = {};

    const comboKeys = Object.keys(combos);
    for (const comboKey of comboKeys) {
        const targetCombo = combos[comboKey];
        for (const targets of targetCombo) {
            if (!palCombos[targets.a]) {
                palCombos[targets.a] = {};
            }
            if (!palCombos[targets.a][comboKey]) {
                palCombos[targets.a][comboKey] = [];
            }
            if (!palCombos[targets.a][comboKey].includes(targets.b)) {
                palCombos[targets.a][comboKey].push(targets.b);
            }
            if (!palCombos[targets.b]) {
                palCombos[targets.b] = {};
            }
            if (!palCombos[targets.b][comboKey]) {
                palCombos[targets.b][comboKey] = [];
            }
            if (!palCombos[targets.b][comboKey].includes(targets.a)) {
                palCombos[targets.b][comboKey].push(targets.a);
            }
        }
    }
    // // 生成文件内容
    const fileContent = objectToJsFileContent(palCombos);

    // // 写入文件
    fs.writeFileSync("./palCombos.js", fileContent, "utf8");
}

processPals();
processCombos();
processPalCombos();

// 转换对象为JS文件内容字符串
function objectToJsFileContent(obj) {// 处理函数序列化的特殊情况
    const replacer = (key, value) => {
        if (typeof value === "function") {
            return value.toString();
        }
        return value;
    };
    // 转换为带缩进的JSON字符串，再替换JSON特定语法为JS语法
    const objStr = JSON.stringify(obj, replacer, 4).replace(/"([^"]+)":/g, "$1:"); // 移除键名的引号

    return `export default ${objStr};`;
}
