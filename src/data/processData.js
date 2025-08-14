import rawPals from "./raw_pals.js";
import rawCombos from "./raw_combos.js";
import fs from "node:fs";

const rawPalKeys = Object.keys(rawPals);
const pals = {};

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
processPals();

function processCombos() {
    const keys = Object.keys(rawCombos);

    const ks = Object.keys(rawPals);
    const obj = {};

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
        obj[k] = tmp;
    }
    // // 生成文件内容
    const fileContent = objectToJsFileContent(obj);

    // // 写入文件
    fs.writeFileSync("./a.js", fileContent, "utf8");
}

// 转换对象为JS文件内容字符串
function objectToJsFileContent(obj) {
    // 转换为带缩进的JSON字符串，再替换JSON特定语法为JS语法
    const objStr = JSON.stringify(obj, null, 4).replace(/"([^"]+)":/g, "$1:"); // 移除键名的引号

    return `export default ${objStr};`;
}
