document.addEventListener("DOMContentLoaded", function () {                
    let closedPopups = new Set(); // Store manually closed popups
    let lastTimeKey = null;
    let lastFPS = null;

    function updateIncidentCounts(timeKey) {                
        map.eachLayer(function (layer) {
            if (layer.feature && layer.feature.properties) {
                let properties = layer.feature.properties;
                let timeIndex = properties.times.indexOf(timeKey);

                if (timeIndex !== -1) {
                    let updatedIncidentCount = properties.NO_OF_INCIDENTS[timeIndex];

                    let tooltipContent = `
                        <div style="width: 110px; white-space: normal; text-align: left;">
                            <b>District:</b> ${properties.DISTRICT}<br>
                            <b>Date:</b> ${timeKey}<br>
                            <b>No. of incidents:</b> ${updatedIncidentCount}
                        </div>
                    `;

                    let popupContent = `
                        <div style="width: 130px; white-space: normal; text-align: left;">
                            <b>District:</b> ${properties.DISTRICT}<br>
                            <b>Date:</b> ${timeKey}<br>
                            <b>No. of incidents:</b> ${updatedIncidentCount}
                        </div>
                    `;

                    let popupOpen = map._popup && map._popup._source === layer;
                    let popupWasClosed = closedPopups.has(layer);

                    if (layer._tooltip && layer._tooltip._map) {
                        layer._tooltip.setContent(tooltipContent);
                    }

                    layer.bindPopup(popupContent);
                    if (popupOpen && !popupWasClosed) {
                        layer.openPopup();
                    }

                    layer.on("popupopen", function () {
                        closedPopups.delete(layer);
                    });

                    layer.on("popupclose", function () {
                        closedPopups.add(layer);
                    });

                    layer.on("mouseover", function (e) {
                        layer.bindTooltip(tooltipContent, { permanent: false, direction: "auto" }).openTooltip(e.latlng);
                    });

                    layer.on("mouseout", function () {
                        layer.closeTooltip();
                    });
                }
            }
        });
    }

    function getCurrentTimeKey() {
        let timeControl = document.querySelector(".leaflet-control-timecontrol.timecontrol-date");
        return timeControl ? timeControl.textContent.trim() : null;
    }

    function getCurrentFPS() {
        let fpsInput = document.querySelector("input.leaflet-control-timecontrol-range");
        return fpsInput ? fpsInput.value : null;
    }

    function findMapObject() {
        let foliumMap = null;
        for (let key in window) {
            if (window[key] instanceof L.Map) {
                foliumMap = window[key];
                break;
            }
        }
        return foliumMap;
    }

    let map = findMapObject();
    
    let fpsSlider = document.querySelector("input.leaflet-control-timecontrol-range");
    if (fpsSlider) {
        fpsSlider.addEventListener("input", function () {
            lastFPS = getCurrentFPS();
            updateIncidentCounts(getCurrentTimeKey());
        });
    }

    setInterval(function () {
        let currentTimeKey = getCurrentTimeKey();
        let currentFPS = getCurrentFPS();

        if (currentTimeKey && currentTimeKey !== lastTimeKey) {
            lastTimeKey = currentTimeKey;
            updateIncidentCounts(currentTimeKey);
        }

        if (currentFPS !== lastFPS) {
            lastFPS = currentFPS;
            updateIncidentCounts(currentTimeKey);
        }
    }, 83);
});