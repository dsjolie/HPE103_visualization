
var vis = d3.selectAll(".spad_vis")
    .datum(function (d, i) {
        return {
            max_styrka: +this.getAttribute("max_styrka"),
            max_dos: +this.getAttribute("max_dos"),
            max_mangd: +this.getAttribute("max_mangd"),
            styrka: +this.getAttribute("max_styrka") * 0.4,
            dos: +this.getAttribute("max_dos") * 0.4,
            mangd: +this.getAttribute("max_mangd") * 0.4,
            mangd_spadning: +this.getAttribute("max_mangd") * 0.4,
            styrka_after: +this.getAttribute("max_styrka") * 0.2,
            dos_after: +this.getAttribute("max_dos") * 0.4,
            mangd_after: +this.getAttribute("max_mangd") * 0.8,
        };
    });

vis.append("label").text("Max styrka: ");
vis.append("input").attr("type", "text").attr("value", function (d) { return d.max_styrka; }).attr("size", 5)
    .on("change", function (d) {
        d.max_styrka = +this.value;
    });

vis.append("label").text("Max dos: ");
vis.append("input").attr("type", "text").attr("value", function (d) { return d.max_dos; }).attr("size", 5)
    .on("change", function (d) {
        d.max_dos = +this.value;
    });

vis.append("label").text("Max mängd: ");
vis.append("input").attr("type", "text").attr("value", function (d) { return d.max_mangd; }).attr("size", 5)
    .on("change", function (d) {
        d.max_mangd = +this.value;
    });


var width = 400;
var height = 300;

createDosageVis(vis);

setInterval(doAnimations,33);

function createDosageVis(container) {

    var vis = container.append("div").classed("visualization", true);

    var before = vis.append("div").classed("settings", true);
    before.append("h3").text("Före");

    createSetting(before, "Styrka", "styrka");
    createSetting(before, "Dos", "dos");
    createSetting(before, "Mängd", "mangd");

    var spadning = vis.append("div").classed("settings", true);
    spadning.append("h3").text("Spädningsvätska");

    spadning.append("div").append("label").text("Styrka: Inte relevant").style("width", "18ex");
    spadning.append("div").append("label").text("Dos: Inte relevant").style("width", "16ex");
    createSetting(spadning, "Mängd", "mangd", "spadning");

    buildVisualizationSVG(vis);

    updateDosageVis();

    var after = vis.append("div").classed("settings", true);
    after.append("h3").text("Efter");

    createSetting(after, "Styrka", "styrka", "after");
    createSetting(after, "Dos", "dos", "after");
    createSetting(after, "Mängd", "mangd", "after");

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
        .attr("y1", 48)
        .attr("y2", 48)
        .attr("stroke", "black");

    var before_g = before_g0.append("g")
        .attr("transform", "translate(20,0)");
    before_g.append("rect").classed("strength before_calc", true)
        .attr("width", 140)
        .attr("height", 20)
        .attr("x", 20)
        .attr("y", 80);
    before_g.append("rect").classed("strength before", true)
        .attr("width", 140)
        .attr("height", 10)
        .attr("x", 20)
        .attr("y", 85);
    before_g.append("rect").classed("volume before", true)
        .attr("width", 20)
        .attr("x", 0)
        .attr("fill", "blue");
    before_g.append("rect").classed("dosage before", true)
        .attr("width", 10)
        .attr("x", 5)
        .attr("fill", "red");
    // Spading
    var spadning_g0 = svg.append("g")
        .attr("transform", "translate(0,120)");
    spadning_g0.append("image")
        .attr("href", "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FNatriumklorid-1.jpg?1539073760839")
        .attr("height", "100")
        .attr("x", "-20");
    var spadning_g = spadning_g0.append("g")
        .attr("transform", "translate(10,0)");
    spadning_g.append("rect").classed("strength spadning", true)
        .attr("width", 100)
        .attr("height", 20)
        .attr("fill", getDosageColor(0))
        .attr("x", 70);
    spadning_g.append("rect").classed("volume spadning", true)
        .attr("width", 40)
        .attr("x", 30)
        .attr("fill", "blue");
    // After
    var after_g0 = svg.append("g");
    after_g0.attr("transform", "translate(200,60)");
    after_g0.append("image")
        .attr("href", "https://cdn.glitch.com/d2a63701-a576-4584-9ecd-f00c9d5f4529%2FSpruta-5.jpg?1539073792589")
        .attr("height", "100")
        .attr("x", "100");
    var after_g = after_g0.append("g");
    after_g.attr("transform", "translate(0,0)");
    after_g.append("rect").classed("strength after_calc", true)
        .attr("width", 70)
        .attr("height", 100)
        .attr("rx", 10)
        .attr("x", 0)
        .attr("y", 0);
    after_g.append("rect").classed("strength after_calc2", true)
        .attr("width", 70)
        .attr("height", 100)
        .attr("rx", 10)
        .attr("x", 50)
        .attr("y", 0);
    after_g.append("rect").classed("strength after", true)
        .attr("width", 100)
        .attr("height", 80)
        .attr("x", 10)
        .attr("y", 10)
        .attr("rx", 10)
        .attr("fill", getDosageColor(0));
    after_g.append("rect").classed("volume after", true)
        .attr("width", 20)
        .attr("x", 40)
        .attr("fill", "blue");
    after_g.append("rect").classed("volume after_calc", true)
        .attr("width", 20)
        .attr("x", 60)
        .attr("fill", "blue");
    after_g.append("rect").classed("dosage after", true)
        .attr("width", 10)
        .attr("x", 50)
        .attr("fill", "red");
    after_g.append("rect").classed("dosage after_calc", true)
        .attr("width", 10)
        .attr("x", 60)
        .attr("fill", "red");
    after_g.append("line")
        .attr("x1", 60)
        .attr("x2", 60)
        .attr("y1", 100)
        .attr("y2", 0)
        .attr("stroke", "white")
        .attr("stroke-opacity", "0.5");
}

function createSetting(vis, label, key, key2) {
    var max_key = "max_" + key;
    if (key2 !== undefined) {
        key = key + "_" + key2;
    }
    var setting = vis.append("div").classed("setting", true);
    setting.append("label").text(label + ": ");
    setting.append("input").attr("type", "text")
        .attr("value", d => d[key]).attr("size", 3)
        .on("change", function (d) {
            d[key] = +this.value;
            updateDosageVis();
            d3.select(this.parentNode).selectAll("input").nodes().forEach(function (n) { n.value = d[key]; })
        });
    setting.append("input").attr("type", "range")
        .attr("value", d => d[key]).style("width", "80px").attr("max", function (d) { return d[max_key]; }).attr("min", 0)
        .on("input", function (d) {
            d[key] = +this.value;
            updateDosageVis();
            d3.select(this.parentNode).selectAll("input").nodes().forEach(function (n) { n.value = d[key]; })
        });
}

function getDosageColor(styrka) {
    const base = 105;
    const sscale = 150;
    var s = sscale * Math.min(styrka, 1);
    return rgb(base + s, base, base + sscale)
}

function updateDosageVis() {

    var svg = d3.selectAll("svg");

    // Before
    var str_bg = svg.selectAll(".strength.before")
        .attr("fill", function (d) { return getDosageColor(d.styrka / d.max_styrka); });

    var str_bg = svg.selectAll(".strength.before_calc")
        .attr("fill", function (d) { return getDosageColor(d.dos / d.mangd / d.max_styrka); });

    var vol_bar = svg.selectAll(".volume.before")
        .attr("height", function (d) {
            return 90 * Math.min(d.mangd / d.max_mangd, 1);
        })
        .attr("y", function (d) { return 100 - 90 * Math.min(d.mangd / d.max_mangd, 1); });

    var dos_bar = svg.selectAll(".dosage.before")
        .attr("height", function (d) {
            return 50 * Math.min(d.dos / d.max_dos, 1);
        })
        .attr("y", function (d) { return 100 - 50 * Math.min(d.dos / d.max_dos, 1); });

    // Spadning
    svg.selectAll(".volume.spadning")
        .attr("height", function (d) {
            return 90 * Math.min(d.mangd_spadning / d.max_mangd, 1);
        })
        .attr("y", function (d) { return 100 - 90 * Math.min(d.mangd_spadning / d.max_mangd, 1); });

    // After
    svg.selectAll(".strength.after")
        .attr("fill", function (d) { return getDosageColor(d.styrka_after / d.max_styrka); });

    svg.selectAll(".strength.after_calc")
        .attr("fill", function (d) { return getDosageColor(d.dos_after / d.mangd_after / d.max_styrka); });

    svg.selectAll(".strength.after_calc2")
        .attr("fill", function (d) { return getDosageColor(d.dos / (d.mangd + d.mangd_spadning) / d.max_styrka); });

    svg.selectAll(".volume.after")
        .attr("height", function (d) {
            return 90 * Math.min(d.mangd_after / d.max_mangd, 1);
        })
        .attr("y", function (d) { return 100 - 90 * Math.min(d.mangd_after / d.max_mangd, 1); });

    svg.selectAll(".volume.after_calc")
        .attr("height", function (d) {
            return 90 * Math.min((d.mangd + d.mangd_spadning) / d.max_mangd, 1);
        })
        .attr("y", function (d) { return 100 - 90 * Math.min((d.mangd + d.mangd_spadning) / d.max_mangd, 1); });

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

function doAnimations()
{
    var svg = d3.selectAll("svg");

    var pos = Math.sin(5*window.performance.now()/1000);
    var amp = 6;
    var max_height=20;
    var padding=2;
    var base_y = 80;
    // Before
    var str_bg = svg.selectAll(".strength.before")
        .attr("height", function (d) { return max_height-amp*(pos+1)-2*padding; }) // pos+1 : -1 - 1 => 0 - 2
        .attr("y", function (d) { return base_y+padding+amp*(pos+1)*0.5; });
}

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}