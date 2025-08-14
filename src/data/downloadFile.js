async function fn() {
    const palEls = document.querySelectorAll(".pals-list .pal .container");
    if (palEls.length === 0) return;
    for (const el of palEls) {
        const imgEl = el.querySelector(".image img");
        if (imgEl === null) continue;
        let url = imgEl.src;
        if (!url) continue;
        // https://palworld.gg/_ipx/q_80&s_60x60/images/full_palicon/T_BlueberryFairy_icon_normal.png
        const name = /\/T_(\w+)_icon/.exec(url)?.[1];
        if (!name) continue;

        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.png`;
        a.click();
        await new Promise((rel) => setTimeout(rel, 100));
    }
}
fn();
