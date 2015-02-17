
// Returns the properties of the district polygon the point is in
var findDistrict = function(point, districtLayer){
	var district;
	districtLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

// Returns a geojson point of the nearest feature of a featureLayer
var findNearest = function (featureLayer, point) {
	var nearest;
	var geojson = featureLayer.getGeoJSON();
	nearest = turf.nearest(point, geojson);
	return nearest;
}

// Sets the marker properties and adds it to the map
var setMarker = function(point, markerLayer, color, icon, size, title, description, map){
	point.properties['marker-color'] = color;
	point.properties['marker-symbol'] = icon;
	point.properties['marker-size'] = size;
	point.properties['title'] = title;
	point.properties['description'] = description;
	map.removeLayer(markerLayer);
	markerLayer.setGeoJSON(point);
	markerLayer.addTo(map);
}

// Get geojson point from a lat and lng pair
var getPoint = function(lat, lng){
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
var setTemplate = function(props, sourceTemplate, output){
	var source = $(sourceTemplate).html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$(output).html(html);
}
