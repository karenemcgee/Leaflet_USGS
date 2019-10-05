var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
            "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var color;
            var r = 255;
            var g = Math.floor(255-80*feature.properties.mag);
            var b = Math.floor(255-80*feature.properties.mag);
            color= "rgb("+r+" ,"+g+","+ b+")"
                  
            var geojsonMarkerOptions = {
            radius: 4*feature.properties.mag,
            fillColor: color,
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    createMap(earthquakes);
}

////// looks good! //////
function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: "pk.eyJ1Ijoia2FyZW5lbWNnZWUiLCJhIjoiY2sweDMzcnFmMDJmZTNjb2M2bTA0bDBsYiJ9.2VPrGXusLoJpCMfTWrgBRQ"
    });

    var baseMaps = {
        "Light Map": lightmap
    };
    
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var map = L.map("map", {
        center: [39.83, -98.58],
        zoom: 4.5,
        layers: [lightmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);

    function getColor(d) {
    return d < 1 ? 'rgb(221,186,122)' : 
            d < 2  ? 'rgb(243,160,125)' :
            d < 3  ? 'rgb(164,142,113)' :
            d < 4  ? 'rgb(113,116,109)' :
            // d < 5  ? 'rgb(255,135,135)' :
            // d < 6  ? 'rgb(255,105,105)' :
            // d < 7  ? 'rgb(255,75,75)' :
            // d < 8  ? 'rgb(255,45,45)' :
            // d < 9  ? 'rgb(255,15,15)' :
                        'rgb(64,103,103)';
    }

    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4],
        labels = [];
  
        div.innerHTML+='Magnitude<br><hr>'
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(map);

}
