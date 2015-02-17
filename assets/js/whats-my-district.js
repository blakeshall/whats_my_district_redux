(function () {
	// Returns the properties of the district polygon the point is in
	window.findDistrict = function(point, districtLayer){
		var district;
		districtLayer.eachLayer(function(layer){
			if (turf.inside(point, layer.feature) ==  true) {
				district = layer;
			}
		});
		return district.feature.properties;
	}

	// Returns a geojson point of the nearest feature of a featureLayer
	window.findNearest = function (featureLayer, point) {
		var nearest;
		var geojson = featureLayer.getGeoJSON();
		nearest = turf.nearest(point, geojson);
		return nearest;
	}

	// Sets the marker properties and adds it to the map
	window.setMarker = function(map, point, markerLayer, options){
		point.properties['marker-color'] = options.color;
		point.properties['marker-symbol'] = options.icon;
		point.properties['marker-size'] = options.size;
		point.properties['title'] = options.title;
		point.properties['description'] = options.description;
		map.removeLayer(markerLayer);
		markerLayer.setGeoJSON(point);
		markerLayer.addTo(map);
	}

	// Get geojson point from a lat and lng pair
	window.getPoint = function(lat, lng){
		var point = {
			"type": "Feature",
			"properties": {},
			"geometry": {
				"type": "Point",
				"coordinates": [lng, lat]
			}
		};
		return point;
	}

	// Set the Handlebars template
	window.setTemplate = function(props, sourceTemplate, output){
		var source = $(sourceTemplate).html();
		var template = Handlebars.compile(source);
		var html = template(props);
		$(output).html(html);
	}
})();