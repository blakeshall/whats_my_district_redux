L.mapbox.accessToken = 'pk.eyJ1IjoiYmxha2VzaGFsbCIsImEiOiJRSkN3Y3prIn0.MfDnpigJE6CVbEsV0xwLfA';
var map;
var geocoder = L.mapbox.geocoder('mapbox.places');
var councilLayer = L.mapbox.featureLayer();
var elemLayer = L.mapbox.featureLayer();
var middleLayer = L.mapbox.featureLayer();
var highLayer = L.mapbox.featureLayer();
var magistrateLayer = L.mapbox.featureLayer();
var houseLayer = L.mapbox.featureLayer();
var senateLayer = L.mapbox.featureLayer();
var schoolBoardLayer = L.mapbox.featureLayer();
var votingLayer = L.mapbox.featureLayer();
var neighborhoodAssocLayer = L.mapbox.featureLayer();
var postOfficeLayer = L.mapbox.featureLayer();
var fireStationLayer = L.mapbox.featureLayer();
var libraryLayer = L.mapbox.featureLayer();
var hospitalLayer = L.mapbox.featureLayer();
var countyLayer = L.mapbox.featureLayer();
var postMarker = L.mapbox.featureLayer();
var fireMarker = L.mapbox.featureLayer();
var libraryMarker = L.mapbox.featureLayer();
var hospitalMarker = L.mapbox.featureLayer();
var lookupMarker = L.marker([0, 0], {
	"marker-color": "#3bb20"
});

var loadData = function(){
    councilLayer.loadURL('assets/data/council.geojson');
  //   .on('ready', function(data){
  //   	councilLayer.eachLayer(function(layer) {
		// 	layer.bindPopup('District: <strong>' + layer.feature.properties.DISTRICT + '</strong>', { closeButton: false});
		// });
  //   })
    elemLayer.loadURL('assets/data/elem.geojson');
    middleLayer.loadURL('assets/data/middle.geojson');
    highLayer.loadURL('assets/data/high.geojson');
    magistrateLayer.loadURL('assets/data/magistrate.geojson');
    houseLayer.loadURL('assets/data/house.geojson');
    senateLayer.loadURL('assets/data/senate.geojson');
    schoolBoardLayer.loadURL('assets/data/school-board.geojson');
    votingLayer.loadURL('assets/data/voting.geojson');
    postOfficeLayer.loadURL('assets/data/post-office.geojson');
    fireStationLayer.loadURL('assets/data/fire-station.geojson');
    libraryLayer.loadURL('assets/data/library.geojson');
    hospitalLayer.loadURL('assets/data/hospital.geojson');
    neighborhoodAssocLayer.loadURL('assets/data/neighborhood-assoc.geojson');
    countyLayer.loadURL('assets/data/county.geojson');
    
}

var findDistrict = function(point, districtLayer){
	var district;
	districtLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findNearest = function (featureLayer, point) {
	var nearest;
	var geojson = featureLayer.getGeoJSON();
	nearest = turf.nearest(point, geojson);
	return nearest;
}

var setMarker = function(point, markerLayer, color, icon, size){
	point.properties['marker-color'] = color;
	point.properties['marker-symbol'] = icon;
	point.properties['marker-size'] = size;
	map.removeLayer(markerLayer);
	markerLayer.setGeoJSON(point);
	markerLayer.addTo(map);
}

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

var setTemplate = function(props, sourceTemplate, output){
	var source = $(sourceTemplate).html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$(output).html(html);
}

var addressLookup = function(query) {
	geocoder.query(query, function(err, data){
		if (data.latlng) {
	        map.setView([data.latlng[0], data.latlng[1]], 13);
	        var point = getPoint(data.latlng[0], data.latlng[1]);
	        findDistricts(point);
	    }
	});
};

var findDistricts = function(point) {
	var postOffice = findNearest(postOfficeLayer, point)
	var fireStation = findNearest(fireStationLayer, point);
	var library = findNearest(libraryLayer, point);
	var hospital = findNearest(hospitalLayer, point);
	setMarker(postOffice, postMarker, '#63b6e5', 'post', 'small');
	setMarker(fireStation, fireMarker,  '#FF0000', 'fire-station', 'small');
	setMarker(library, libraryMarker,  '#57FF65', 'library', 'small');
	setMarker(hospital, hospitalMarker,  '#FFFFFF', 'hospital', 'small');
	setTemplate(findDistrict(point, councilLayer), '#council-template', '#council-results');
	setTemplate(findDistrict(point, elemLayer), '#elem-template', '#elem-results');
	setTemplate(findDistrict(point, middleLayer), '#middle-template', '#middle-results');
	setTemplate(findDistrict(point, highLayer), '#high-template', '#high-results');
	setTemplate(findDistrict(point, houseLayer), '#house-template', '#house-results');
	setTemplate(findDistrict(point, senateLayer), '#senate-template', '#senate-results');
	setTemplate(findDistrict(point, schoolBoardLayer), '#school-board-template', '#school-board-results');
	setTemplate(findDistrict(point, votingLayer), '#voting-template', '#voting-results');
	setTemplate(findDistrict(point, magistrateLayer), '#magistrate-template', '#magistrate-results');
	// setTemplate(findDistrict(point, neighborhoodAssocLayer), '#neighborhood-assoc-template', '#neighborhood-assoc-results');
	lookupMarker.setLatLng([point.geometry.coordinates[1], point.geometry.coordinates[0]]);
	lookupMarker.setOpacity(1)

};

councilLayer.eachLayer(function(layer) {
	layer.bindPopup('District: <strong>' + layer.feature.properties.DISTRICT + '</strong>', { closeButton: false});
});

$(document).ready(function(){
	map = L.mapbox.map('map', 'mapbox.light')
		.setView([38.05, -84.5], 12);

	lookupMarker.setOpacity(0)
	lookupMarker.addTo(map);
	loadData();
	countyLayer.addTo(map);
	
	countyLayer.on('click', function(e) {
		var point = getPoint(e.latlng.lat, e.latlng.lng);
		findDistricts(point);
		
	});
	$('#search').on('click', function(e){
		e.preventDefault();
		addressLookup($('#search-address').val() + ' Lexington , KY');
	});
})