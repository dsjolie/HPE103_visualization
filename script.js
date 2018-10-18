const before_containers = [
    {
        "label": "ampull 5 ml",
        "volume": 5,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    },
    {
        "label": "ampull 10 ml",
        "volume": 10,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    },
    {
        "label": "injektionsflaska 15 ml",
        "volume": 15,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    },
    {
        "label": "injektionsflaska 45 ml",
        "volume": 45,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    }
]

const spadning_containers = [
    {
        "label": "behållare 10 ml",
        "volume": 10,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    },
    {
        "label": "behållare 20 ml",
        "volume": 20,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    },
    {
        "label": "flaska 100 ml",
        "volume": 100,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    },
    {
        "label": "påse 500 ml",
        "volume": 500,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    }
]

const after_containers = [
    {
        "label": "spruta 10 ml",
        "volume": 10,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FSpruta-5.jpg?1539073792589"
    },
    {
        "label": "spruta 20 ml",
        "volume": 20,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FSpruta-5.jpg?1539073792589"
    },
    {
        "label": "spruta 40 ml",
        "volume": 40,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FSpruta-5.jpg?1539073792589"
    },
    {
        "label": "påse 500 ml",
        "volume": 500,
        "image": "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810"
    }
]

var vis = d3.selectAll(".spad_vis")
    .datum(function (d, i) {
        return {
            max_styrka: +this.getAttribute("max_styrka"),
            max_dos: +this.getAttribute("max_dos"),
            max_mangd: +this.getAttribute("max_mangd"),
            max_mangd_fore: +this.getAttribute("max_mangd"),
            max_mangd_spadning: +this.getAttribute("max_mangd") * 2,
            max_mangd_after: +100,
            styrka: +this.getAttribute("max_styrka") * 0.4,
            dos: +this.getAttribute("max_dos") * 0.4,
            mangd_fore: +this.getAttribute("max_mangd") * 0.4,
            mangd_spadning: +this.getAttribute("max_mangd") * 0.4,
            styrka_after: +this.getAttribute("max_styrka") * 0.2,
            dos_after: +this.getAttribute("max_dos") * 0.4,
            mangd_after: +this.getAttribute("max_mangd") * 0.8,
        };
    });

var width = 400;
var height = 300;

const volume_color = "hsl(220,100%,50%)";
const dosage_color = "hsl(360,100%,50%)";

createDosageVis(vis);

setInterval(doAnimations, 33);

function createDosageVis(container) {

    var vis = container.append("div").classed("visualization", true);

    var before = vis.append("div").classed("settings", true);
    before.append("h3").text("Före");

    before.append("label").text("Behållare: ");
    before.append("select").attr("name", "max_mangd_fore")
        .on("change", function (d) {
            d.max_mangd_fore = +this.value;
            d.mangd_fore = Math.min(d.max_mangd_fore, d.mangd_fore);
            updateDosageVis();
        })
        .selectAll("option").data(before_containers).enter()
        .append("option").attr("value", d => d.volume).text(d => d.label);


    createSetting(before, "Styrka", "styrka");
    createSetting(before, "Dos", "dos");
    createSetting(before, "Mängd", "mangd_fore");

    var spadning = vis.append("div").classed("settings", true);
    spadning.append("h3").text("Spädningsvätska");

    spadning.append("label").text("Behållare: ");
    spadning.append("select").attr("name", "max_mangd_spadning")
        .on("change", function (d) {
            d.max_mangd_spadning = +this.value;
            d.mangd_spadning = Math.min(d.max_mangd_spadning, d.mangd_spadning);
            updateDosageVis();
        })
        .selectAll("option").data(spadning_containers).enter()
        .append("option").attr("value", d => d.volume).text(d => d.label);


    spadning.append("div").append("label").text("Styrka: Inte relevant").style("width", "18ex");
    spadning.append("div").append("label").text("Dos: Inte relevant").style("width", "16ex");
    createSetting(spadning, "Mängd", "mangd_spadning");

    buildVisualizationSVG(vis);

    var after = vis.append("div").classed("settings", true);
    after.append("h3").text("Efter");

    after.append("label").text("Behållare: ");
    after.append("select").attr("name", "max_mangd_after")
        .on("change", function (d) {
            d.max_mangd_after = +this.value;
            d.mangd_after = Math.min(d.max_mangd_after, d.mangd_after);
            updateDosageVis();
        })
        .selectAll("option").data(d => after_containers.map(function (c) { c.max_mangd_after = d.max_mangd_after; return c; })).enter()
        .append("option").attr("value", d => d.volume).text(d => d.label).attr("selected", function (d) { return (d.max_mangd_after == this.value) ? "" : undefined; });

    createSetting(after, "Styrka", "styrka", "after");
    createSetting(after, "Dos", "dos", "after");
    createSetting(after, "Mängd", "mangd_after");

    updateDosageVis();

}

function buildVisualizationSVG(vis) {
    var svg = vis.append("svg");
    svg.attr("width", "100%");
    svg.attr("viewBox", "0 0 400 300");

    // Before
    var before_g0 = svg.append("g")
        .attr("transform", "translate(20,0)");
    before_g0.append("image")
        .attr("href", "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FAmpull-4.jpg?1539073731810")
        .attr("height", "100")
        .attr("x", "-30")
        .attr("y", "7");
    before_g0.append("line")
        .attr("x1", 0)
        .attr("x2", 40)
        .attr("y1", 45)
        .attr("y2", 45)
        .attr("stroke", "black");
    before_g0.append("text").classed("max_label", true).attr("max_key", "max_mangd_fore")
        .attr("x", 20)
        .attr("y", 42)
        .style("font-size", "1ex")
        .text("10 ml");


    var before_g = before_g0.append("g")
        .attr("transform", "translate(20,0)");
    before_g.append("rect").classed("strength before_calc", true)
        .attr("width", 70)
        .attr("height", 20)
        .attr("x", 20)
        .attr("y", 80);
    before_g.append("rect").classed("strength before", true)
        .attr("width", 70)
        .attr("height", 10)
        .attr("x", 20)
        .attr("y", 85);
    before_g.append("rect").classed("volume before", true)
        .attr("width", 20)
        .attr("x", 0)
        .attr("fill", volume_color);
    before_g.append("rect").classed("dosage before", true)
        .attr("width", 10)
        .attr("x", 5)
        .attr("fill", "red");

    // Spading
    var spadning_g0 = svg.append("g")
        .attr("transform", "translate(0,110)");
    spadning_g0.append("image")
        .attr("href", "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FNatriumklorid-1.jpg?1539073760839")
        .attr("height", "120")
        .attr("x", "-20")
        .attr("y", "-10");
    spadning_g0.append("line")
        .attr("x1", 0)
        .attr("x2", 80)
        .attr("y1", 38)
        .attr("y2", 38)
        .attr("stroke", "black");
    spadning_g0.append("text").classed("max_label", true).attr("max_key", "max_mangd_spadning")
        .attr("x", 50)
        .attr("y", 35)
        .style("font-size", "1ex")
        .text("100 ml");

    var spadning_g = spadning_g0.append("g")
        .attr("transform", "translate(10,0)");
    spadning_g.append("rect").classed("strength spadning", true)
        .attr("width", 50)
        .attr("height", 20)
        .attr("fill", getDosageColor(0))
        .attr("x", 70)
        .attr("y", 80);
    spadning_g.append("rect").classed("volume spadning", true)
        .attr("width", 40)
        .attr("x", 30)
        .attr("fill", volume_color);
    // After
    var after_g0 = svg.append("g");
    after_g0.attr("transform", "translate(200,60)");
    after_g0.append("image")
        .attr("href", "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FSpruta-5.jpg?1539073792589")
        .attr("height", "100")
        .attr("x", "20");
    var after_g = after_g0.append("g");
    after_g.attr("transform", "translate(0,0)");
    after_g.append("rect").classed("strength after_calc", true)
        .attr("width", 50)
        .attr("height", 20)
        .attr("x", -50)
        .attr("y", 80);
    after_g.append("rect").classed("strength after_calc_from_before", true)
        .attr("width", 20)
        .attr("height", 130)
        .attr("x", -70)
        .attr("y", 20);
    after_g.append("rect").classed("strength after", true)
        .attr("width", 50)
        .attr("height", 10)
        .attr("x", -50)
        .attr("y", 85)
        .attr("fill", getDosageColor(0));
    after_g.append("rect").classed("volume after", true)
        .attr("width", 40)
        .attr("x", 0)
        .attr("fill", volume_color);
    after_g.append("rect").classed("dosage after", true)
        .attr("width", 10)
        .attr("x", 15)
        .attr("fill", "red");

    after_g.append("rect").classed("volume after_calc", true)
        .attr("width", 40)
        .attr("x", 0)
        .attr("fill", "none")
        .attr("stroke", "black");
    after_g.append("rect").classed("dosage after_calc", true)
        .attr("width", 10)
        .attr("x", 15)
        .attr("fill", "none")
        .attr("stroke", "black");

    var guides = svg.append("g");

    guides.append("text")
        .attr("x", 150)
        .attr("y", 20)
        .style("font-size", "1ex")
        .text("Angiven och uträknad styrka skall vara samma");

    guides.append("line")
        .attr("x1", 160)
        .attr("x2", 95)
        .attr("y1", 25)
        .attr("y2", 74)
        .attr("stroke", "black");

    guides.append("circle")
        .attr("cx", 95)
        .attr("cy", 90)
        .attr("r", 16)
        .attr("fill", "none")
        .attr("stroke", "black");

    guides.append("line")
        .attr("x1", 180)
        .attr("x2", 155)
        .attr("y1", 25)
        .attr("y2", 134)
        .attr("stroke", "black");

    guides.append("circle")
        .attr("cx", 155)
        .attr("cy", 150)
        .attr("r", 16)
        .attr("fill", "none")
        .attr("stroke", "black");

    guides.append("text")
        .attr("x", 160)
        .attr("y", 190)
        .style("font-size", "1ex")
        .text("Staplarna för volym och dos skall matcha de svarta ramarna");

    guides.append("line")
        .attr("x1", 270)
        .attr("x2", 245)
        .attr("y1", 180)
        .attr("y2", 150)
        .attr("stroke", "black");

}

function createSetting(vis, label, key, key2) {
    var max_key = "max_" + key;
    if (key2 !== undefined) {
        key = key + "_" + key2;
    }
    var setting = vis.append("div").classed("setting", true);
    setting.append("label").text(label + ": ");
    setting.append("input").attr("type", "text").classed("max_text", true)
        .attr("max_key", max_key)
        .attr("value", d => d[key]).attr("size", 3)
        .on("change", function (d) {
            d[key] = +this.value;
            updateDosageVis();
            d3.select(this.parentNode).selectAll("input").nodes().forEach(function (n) { n.value = d[key]; })
        });
    setting.append("input").attr("type", "range").classed("max_slider", true)
        .attr("max_key", max_key)
        .attr("value", d => d[key]).style("width", "80px").attr("max", function (d) { return d[max_key]; }).attr("min", 0)
        .on("input", function (d) {
            d[key] = +this.value;
            updateDosageVis();
            d3.select(this.parentNode).selectAll("input").nodes().forEach(function (n) { n.value = d[key]; })
        });
}

function getDosageColor(styrka) {
    const base = 80;
    const sscale = 150;
    var s = sscale * Math.min(styrka, 1);
    //return rgb(base + s, base, base + sscale);
    return "hsl(" + (200 + 140 * Math.min(styrka, 1)) + ",100%,70%)";
}

function updateDosageVis() {

    var settings = d3.selectAll(".max_slider").attr("max", function (d) { return d[this.getAttribute("max_key")]; });
    var settings = d3.selectAll(".max_text").each(function (d) { this.value = Math.min(+this.value, d[this.getAttribute("max_key")]); });
    var settings = d3.selectAll(".max_label").text(function (d) { return d[this.getAttribute("max_key")] + " ml"; });

    var svg = d3.selectAll("svg");

    // Before
    var str_bg = svg.selectAll(".strength.before")
        .attr("fill", function (d) { return getDosageColor(d.styrka / d.max_styrka); });

    var str_bg = svg.selectAll(".strength.before_calc")
        .attr("fill", function (d) { return getDosageColor(d.dos / d.mangd_fore / d.max_styrka); });

    var vol_bar = svg.selectAll(".volume.before")
        .attr("height", function (d) {
            return 55 * Math.min(d.mangd_fore / d.max_mangd_fore, 1);
        })
        .attr("y", function (d) { return 100 - 55 * Math.min(d.mangd_fore / d.max_mangd_fore, 1); });

    var dos_bar = svg.selectAll(".dosage.before")
        .attr("height", function (d) {
            return 50 * Math.min(d.dos / d.max_dos, 1);
        })
        .attr("y", function (d) { return 100 - 50 * Math.min(d.dos / d.max_dos, 1); });

    // Spadning
    const spadning_bar_max_height = 62;
    svg.selectAll(".volume.spadning")
        .attr("height", function (d) {
            return spadning_bar_max_height * Math.min(d.mangd_spadning / d.max_mangd_spadning, 1);
        })
        .attr("y", function (d) { return 100 - spadning_bar_max_height * Math.min(d.mangd_spadning / d.max_mangd_spadning, 1); });

    // After
    svg.selectAll(".strength.after")
        .attr("fill", function (d) { return getDosageColor(d.styrka_after / d.max_styrka); });

    svg.selectAll(".strength.after_calc")
        .attr("fill", function (d) { return getDosageColor(d.dos_after / d.mangd_after / d.max_styrka); });

    svg.selectAll(".strength.after_calc_from_before")
        .attr("fill", function (d) { return getDosageColor(d.dos / (d.mangd_fore + d.mangd_spadning) / d.max_styrka); });

    svg.selectAll(".volume.after")
        .attr("height", function (d) {
            return 90 * Math.min(d.mangd_after / d.max_mangd_after, 1);
        })
        .attr("y", function (d) { return 100 - 90 * Math.min(d.mangd_after / d.max_mangd_after, 1); });

    svg.selectAll(".volume.after_calc")
        .attr("height", function (d) {
            return 90 * (d.mangd_fore + d.mangd_spadning) / d.max_mangd_after;
        })
        .attr("y", function (d) { return 100 - 90 * (d.mangd_fore + d.mangd_spadning) / d.max_mangd_after; });

    svg.selectAll(".dosage.after")
        .attr("height", function (d) {
            return 50 * Math.min(d.dos_after / d.max_dos, 1);
        })
        .attr("y", function (d) { return 100 - 50 * Math.min(d.dos_after / d.max_dos, 1); });

    svg.selectAll(".dosage.after_calc")
        .attr("height", function (d) {
            return 50 * Math.min(d.dos / d.max_dos, 1);
        })
        .attr("y", function (d) { return 100 - 50 * Math.min(d.dos / d.max_dos, 1); });

}

function doAnimations() {
    var svg = d3.selectAll("svg");

    var pos = Math.sin(5 * window.performance.now() / 1000);
    var amp = 1;
    var max_height = 20;
    var padding = 4;
    var base_y = 80;
    // Before
    var str_bg = svg.selectAll(".strength.before")
        .attr("height", function (d) { return max_height - amp * (pos + 1) - 2 * padding; }) // pos+1 : -1 - 1 => 0 - 2
        .attr("y", function (d) { return base_y + padding + amp * (pos + 1) * 0.5; });
    var str_bg = svg.selectAll(".strength.after")
        .attr("height", function (d) { return max_height - amp * (pos + 1) - 2 * padding; }) // pos+1 : -1 - 1 => 0 - 2
        .attr("y", function (d) { return base_y + padding + amp * (pos + 1) * 0.5; });
}

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}