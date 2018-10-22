const before_containers = [
    {
        "label": "ampull 5 ml",
        "volume": 5,
        "image": "images/Ampull-4.jpg"
    },
    {
        "label": "ampull 10 ml",
        "volume": 10,
        "image": "images/Ampull-4.jpg"
    },
    {
        "label": "injektionsflaska 15 ml",
        "volume": 15,
        "image": "images/Ampull-14.jpg"
    },
    {
        "label": "injektionsflaska 45 ml",
        "volume": 45,
        "image": "images/Ampull-14.jpg"
    }
]

const spadning_containers = [
    {
        "label": "behållare 10 ml",
        "volume": 10,
        "image": "images/Natriumklorid-10ml.jpg"
    },
    {
        "label": "behållare 20 ml",
        "volume": 20,
        "image": "images/Natriumklorid-10ml.jpg"
    },
    {
        "label": "flaska 100 ml",
        "volume": 100,
        "image": "images/bottle.jpg"
    },
    {
        "label": "påse 500 ml",
        "volume": 500,
        "image": "images/bag.jpg"
    }
]

const after_containers = [
    {
        "label": "spruta 10 ml",
        "volume": 10,
        "image": "images/Spruta-10ml.jpg"
    },
    {
        "label": "spruta 20 ml",
        "volume": 20,
        "image": "images/Spruta-20ml.jpg"
    },
    {
        "label": "spruta 40 ml",
        "volume": 40,
        "image": "images/Spruta-20ml.jpg"
    },
    {
        "label": "påse 500 ml",
        "volume": 500,
        "image": "images/bag.jpg"
    }
]

var vis = d3.selectAll(".spad_vis")
    .datum(function (d, i) {
        return {
            max_styrka: +this.getAttribute("max_styrka"),
            max_dos: +this.getAttribute("max_dos"),
            max_mangd: +this.getAttribute("max_mangd"),
            max_mangd_fore: 5,
            max_mangd_spadning: 10,
            max_mangd_after: 10,
            styrka: +this.getAttribute("max_styrka") * 0.4,
            dos: +this.getAttribute("max_dos") * 0.4,
            mangd_fore: 2,
            mangd_spadning: 4,
            styrka_after: +this.getAttribute("max_styrka") * 0.2,
            dos_after: +this.getAttribute("max_dos") * 0.4,
            mangd_after: 6,
            before_image: "images/Ampull-4.jpg",
            spadning_image: "images/Natriumklorid-10ml.jpg",
            after_image: "images/Spruta-20ml.jpg"
        };
    });

var width = 370;
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
            d.before_image = before_containers[this.selectedIndex].image;
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
            d.spadning_image = spadning_containers[this.selectedIndex].image;
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
            d.after_image = after_containers[this.selectedIndex].image;
            updateDosageVis();
        })
        .selectAll("option").data(d => after_containers.map(function (c) { c.max_mangd_after = d.max_mangd_after; return c; })).enter()
        .append("option").attr("value", d => d.volume).text(d => d.label).attr("selected", function (d) { return (d.max_mangd_after == this.value) ? "" : undefined; });

    createSetting(after, "Styrka", "styrka", "after");
    createSetting(after, "Dos", "dos", "after");
    createSetting(after, "Mängd", "mangd_after");

    vis.append("button").text("Visa/göm hjälp")
        .on("click", function () {
            d3.selectAll(".guides").style("visibility", function () { return this.style["visibility"] == "hidden" ? "visible" : "hidden"; });
        });

    updateDosageVis();

}

function buildVisualizationSVG(vis) {
    var svg = vis.append("svg");
    svg.attr("width", "100%");
    svg.attr("viewBox", "0 0 370 300");


    // Before
    var before_g0 = svg.append("g")
        .attr("transform", "translate(20,0)");
    before_g0.append("image").classed("before", true)
        .attr("href", d => d.before_image)
        .attr("height", "100")
        .attr("x", "-10")
        .attr("y", "0");
    before_g0.append("line")
        .attr("x1", 0)
        .attr("x2", 60)
        .attr("y1", 41)
        .attr("y2", 41)
        .attr("stroke", "black");
    before_g0.append("text").classed("max_label", true).attr("max_key", "max_mangd_fore")
        .attr("x", 40)
        .attr("y", 39)
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
    spadning_g0.append("image").classed("spadning", true)
        .attr("href", d => d.spadning_image)
        .attr("height", "110")
        .attr("x", "0")
        .attr("y", "-8");
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
    after_g0.append("image").classed("after", true)
        .attr("href", d => d.after_image)
        .attr("height", "100")
        .attr("x", "40");

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

    after_g0.append("line")
        .attr("x1", 0)
        .attr("x2", 80)
        .attr("y1", 20)
        .attr("y2", 20)
        .attr("stroke", "black");
    after_g0.append("text").classed("max_label", true).attr("max_key", "max_mangd_after")
        .attr("x", 0)
        .attr("y", 15)
        .style("font-size", "1ex")
        .text("? ml");

    var guides = svg.append("g").classed("guides",true);

    appendMultilineText(guides, ["Styrka Före", "Inmatad av dig"], 62, 52);
    guides.append("line")
        .attr("x1", 80)
        .attr("x2", 75)
        .attr("y1", 65)
        .attr("y2", 90)
        .attr("stroke", "black");

    appendMultilineText(guides, ["Styrka Före", "Automatiskt uträknad","baserat på Dos/Mängd Före"], 45, 117);
    guides.append("line")
        .attr("x1", 78)
        .attr("x2", 85)
        .attr("y1", 110)
        .attr("y2", 98)
        .attr("stroke", "black");

    appendMultilineText(guides, ["Styrka Efter", "Automatiskt uträknad baserat på Före och Spädning"], 125, 230);
    guides.append("line")
        .attr("x1", 150)
        .attr("x2", 140)
        .attr("y1", 220)
        .attr("y2", 200)
        .attr("stroke", "black");

    appendMultilineText(guides, ["Styrka Efter", "Inmatad av dig"], 170, 96);
    guides.append("line")
        .attr("x1", 190)
        .attr("x2", 180)
        .attr("y1", 110)
        .attr("y2", 150)
        .attr("stroke", "black");

    appendMultilineText(guides, ["Styrka Efter", "Automatisk uträknad", "baserat på Dos/Mängd Efter"], 160, 180);
    guides.append("line")
        .attr("x1", 185)
        .attr("x2", 180)
        .attr("y1", 172)
        .attr("y2", 158)
        .attr("stroke", "black");

    appendMultilineText(guides, ["Automatiskt uträknad Styrka och Styrka Inmatad av dig", "skall vara samma (samma färg)"], 120, 10);
    guides.append("line")
        .attr("x1", 160)
        .attr("x2", 110)
        .attr("y1", 25)
        .attr("y2", 74)
        .attr("stroke", "black");

    appendMultilineText(guides, ["Blå stapel visar mängd", "Röd stapel visar dos"], 40, 10);
    guides.append("line")
        .attr("x1", 55)
        .attr("x2", 50)
        .attr("y1", 22)
        .attr("y2", 74)
        .attr("stroke", "black");

    guides.append("circle")
        .attr("cx", 110)
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

    appendMultilineText(guides, ["Staplarna för volym och dos skall", "matcha de svarta ramarna"], 240, 215);
    guides.append("line")
        .attr("x1", 280)
        .attr("x2", 240)
        .attr("y1", 205)
        .attr("y2", 163)
        .attr("stroke", "black");

    var strength_gradient = svg.append("defs").append("linearGradient")
        .attr("id", "strength_gradient")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");
    strength_gradient.append("stop")
        .attr("offset", "0%")
        .attr("style", "stop-color:hsl(340,100%,70%);stop-opacity:1");
    strength_gradient.append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color:hsl(200,100%,70%);stop-opacity:1");

    var strength_legend = svg.append("g")
        .attr("transform", "translate(300,30)");

    strength_legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 150)
        .attr("fill", "url(#strength_gradient");

    strength_legend.append("text")
        .attr("x", 22)
        .attr("y", 10)
        .style("font-size", "1ex")
        .text(d => "Styrka: " + d.max_styrka);

    strength_legend.append("line")
        .attr("x1", 0)
        .attr("x2", 60)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "black");

    strength_legend.append("text")
        .attr("x", 22)
        .attr("y", 147)
        .style("font-size", "1ex")
        .text("Styrka: 0");

    strength_legend.append("line")
        .attr("x1", 0)
        .attr("x2", 60)
        .attr("y1", 150)
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

    d3.selectAll(".max_slider").attr("max", function (d) { return d[this.getAttribute("max_key")]; });
    d3.selectAll(".max_text").each(function (d) { this.value = Math.min(+this.value, d[this.getAttribute("max_key")]); });
    d3.selectAll(".max_label").text(function (d) { return d[this.getAttribute("max_key")] + " ml"; });

    d3.selectAll("image.before").attr("href", function (d) { return d.before_image; });
    d3.selectAll("image.spadning").attr("href", function (d) { return d.spadning_image; });
    d3.selectAll("image.after").attr("href", function (d) { return d.after_image; });

    var svg = d3.selectAll("svg");

    // Before
    const before_bar_max_height = 60;
    var str_bg = svg.selectAll(".strength.before")
        .attr("fill", function (d) { return getDosageColor(d.styrka / d.max_styrka); });

    var str_bg = svg.selectAll(".strength.before_calc")
        .attr("fill", function (d) { return getDosageColor(d.dos / d.mangd_fore / d.max_styrka); });

    var vol_bar = svg.selectAll(".volume.before")
        .attr("height", function (d) {
            return before_bar_max_height * Math.min(d.mangd_fore / d.max_mangd_fore, 1);
        })
        .attr("y", function (d) { return 100 - before_bar_max_height * Math.min(d.mangd_fore / d.max_mangd_fore, 1); });

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
    const after_bar_max_height = 80;
    svg.selectAll(".strength.after")
        .attr("fill", function (d) { return getDosageColor(d.styrka_after / d.max_styrka); });

    svg.selectAll(".strength.after_calc")
        .attr("fill", function (d) { return getDosageColor(d.dos_after / d.mangd_after / d.max_styrka); });

    svg.selectAll(".strength.after_calc_from_before")
        .attr("fill", function (d) { return getDosageColor(d.dos / (d.mangd_fore + d.mangd_spadning) / d.max_styrka); });

    svg.selectAll(".volume.after")
        .attr("height", function (d) {
            return after_bar_max_height * Math.min(d.mangd_after / d.max_mangd_after, 1);
        })
        .attr("y", function (d) { return 100 - after_bar_max_height * Math.min(d.mangd_after / d.max_mangd_after, 1); });

    svg.selectAll(".volume.after_calc")
        .attr("height", function (d) {
            return after_bar_max_height * (d.mangd_fore + d.mangd_spadning) / d.max_mangd_after;
        })
        .attr("y", function (d) { return 100 - after_bar_max_height * (d.mangd_fore + d.mangd_spadning) / d.max_mangd_after; });

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

function appendMultilineText(svg, text_lines, x, y) {

    var g = svg.append("g")
        .attr("transform", "translate(" + x + "," + y + ")");
    g.selectAll("text").data(text_lines).enter()
        .append("text")
        .attr("x", 0)
        .attr("y", function (d, i) { return i * 8; })
        .style("font-size", "0.8ex")
        .text(d => d);
}