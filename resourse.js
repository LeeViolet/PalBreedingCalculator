async function fn() {
    const palsList = document.querySelector(".pals-list");
    const pals = palsList.querySelectorAll(".pal");

    const list = [];
    const elementImageList = [];

    for (const pal of pals) {
        const elementImgUrls = pal.querySelectorAll(".element img");
        const elementList = [];
        for (const elementImgUrl of elementImgUrls) {
            // https://palworld.gg/images/icons/T_Icon_element_s_07.png
            const elementName = +elementImgUrl.src.match(
                /T_Icon_element_s_(\d+)/
            )[1];
            if (!elementImageList.some((el) => el === elementName)) {
                elementImageList.push(elementName);
                // 下载图片
                const img = new Image();
                img.src = elementImgUrl.src;
                await new Promise((resolve) => {
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        const base64 = canvas.toDataURL("image/png");
                        const a = document.createElement("a");
                        a.href = base64;
                        a.download = `element_${elementName}.png`;
                        a.click();
                        setTimeout(resolve, 100);
                    };
                });
            }
            elementList.push(elementName);
        }

        const imgElement = pal.querySelector(".image img");
        // https://palworld.gg/_ipx/q_80&s_60x60/images/full_palicon/T_Baphomet_icon_normal.png
        const palNameEN = imgElement.src.match(/T_(.*)_icon_nor/)[1];
        const palNameCN = imgElement.alt;
        const fecundity = +pal
            .querySelector(".comb-rank")
            .textContent.replaceAll(/[()]/g, "");
        const rarityLv = +pal.querySelector(".rarity .lv").textContent;
        const rarityName = pal.querySelector(".rarity .name").textContent;
        // 下载图片
        const img = new Image();
        img.src = imgElement.src;
        await new Promise((resolve) => {
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.href = base64;
                a.download = `${palNameEN}.png`;
                a.click();
                setTimeout(resolve, 100);
            };
        });

        list.push({
            palNameEN,
            palNameCN,
            fecundity,
            rarityLv,
            rarityName,
            elementList
        });
    }

    // 将list导出为json文件
    const url = URL.createObjectURL(new Blob([JSON.stringify(list, null, 4)]), {
        type: "application/json"
    });

    const a = document.createElement("a");
    a.href = url;
    a.download = "pals.json";
    a.click();

    // 释放url
    URL.revokeObjectURL(url);
}

fn();
