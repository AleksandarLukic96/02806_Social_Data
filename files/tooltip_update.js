// tooltip_update.js

console.log("Tooltip script loaded!");

function updateTooltips(timeIndex, districtData) {
    console.log("Updating tooltips for time index:", timeIndex);

    var keys = Object.keys(districtData);  // Extract the time slices (e.g., "2004 - January")
    if (timeIndex >= keys.length) return;

    var timeKey = keys[timeIndex];  // Get the current time slice (e.g., "2004 - January")
    var districts = districtData[timeKey] || {};  // Get district counts for this slice

    console.log("Time key:", timeKey, "District Data:", districts);  // Debugging the current data

    // Use the globally accessible 'map' object
    window.map.eachLayer(function (layer) {
        if (layer.feature && layer.feature.properties) {
            var districtName = layer.feature.properties.DISTRICT;
            var count = districts[districtName] || 0;
            console.log("Updating tooltip for:", districtName, "Count:", count);

            var tooltipContent = "District: " + districtName + "<br>Total Incidents: " + count +
                                 "<br>Time: " + timeKey;

            layer.bindTooltip(tooltipContent, {sticky: true});  // Update tooltip dynamically
        } else {
            console.log("Layer skipped:", layer);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded, running tooltip update!");

    setTimeout(function() {
        updateTooltips(0, districtData);  // Initialize tooltips with first time slice
    }, 2000);  // Delay to ensure map loads

    // Check for heatmap layer and add event listener for time updates
    var heatmapLayer = document.querySelector("video, canvas");
    if (heatmapLayer) {
        heatmapLayer.addEventListener("timeupdate", function () {
            var timeIndex = Math.floor(this.currentTime);
            console.log("Time slice changed, updating tooltips:", timeIndex);
            updateTooltips(timeIndex, districtData);
        });
    } else {
        console.log("Heatmap video/canvas layer not found!");
    }
});
