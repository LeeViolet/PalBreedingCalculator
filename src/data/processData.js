import pals from "./pals.js";
import combos from "./raw_combos.js";
import fs from "node:fs";

const keys = Object.keys(combos);

const ks = Object.keys(pals);
const obj = {};

for (const k of ks) {
    const i = keys.indexOf(k.toLocaleLowerCase());
    if (i === -1) continue;
    const pal = combos[keys[i]];
    const tmp = [];
    for (const item of pal) {
        const a = ks.find((el) => el.toLocaleLowerCase() === item.A);
        const b = ks.find((el) => el.toLocaleLowerCase() === item.B);
        if (!a || !b) continue;
        tmp.push({ a, b });
    }
    obj[k] = tmp;
}

// 转换对象为JS文件内容字符串
function objectToJsFileContent(obj, varName = "a") {
    // 处理函数序列化的特殊情况
    const replacer = (key, value) => {
        if (typeof value === "function") {
            return value.toString();
        }
        return value;
    };

    // 转换为带缩进的JSON字符串，再替换JSON特定语法为JS语法
    const objStr = JSON.stringify(obj, replacer)
        .replace(/"([^"]+)":/g, "$1:") // 移除键名的引号
        .replace(/"function/g, "function"); // 移除函数前面的引号

    return `export default ${objStr};`;
}

// // 生成文件内容
const fileContent = objectToJsFileContent(obj);

// // 写入文件
fs.writeFileSync("./a.js", fileContent, "utf8");
