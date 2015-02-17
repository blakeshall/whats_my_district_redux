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
var postOfficeLayer = L.mapbox.featureLayer();
var countyLayer = L.mapbox.featureLayer();
var postMarker = L.mapbox.featureLayer();
var lookupMarker = L.marker([38.05, -84.5], {
	"marker-color": "#3bb20"
});

var load_data = function(){
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
    countyLayer.loadURL('assets/data/county.geojson');
    
}

var findCouncil = function(point) {
	var district;
	councilLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findElementary = function(point) {
	var district;
	elemLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findMiddle = function(point) {
	var district;
	middleLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findHigh = function(point) {
	var district;
	highLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findMagistrate = function(point) {
	var district;
	magistrateLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findHouse = function(point) {
	var district;
	houseLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findSenate = function(point) {
	var district;
	senateLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findSchoolBoard = function(point) {
	var district;
	schoolBoardLayer.eachLayer(function(layer){
		if (turf.inside(point, layer.feature) ==  true) {
			district = layer;
		}
	});
	return district.feature.properties;
}

var findVoting = function(point) {
	var district;
	votingLayer.eachLayer(function(layer){
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

var setPostMarker =  function(point){
	point.properties['marker-color'] = '#63b6e5';
	point.properties['marker-symbol'] = 'post';
	point.properties['marker-size'] = 'small';
	map.removeLayer(postMarker);
	postMarker.setGeoJSON(point);
	postMarker.addTo(map);
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

var setCouncil = function(props) {
	var source = $('#council-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#council-results').html(html);
}

var setElem = function(props) {
	var source = $('#elem-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#elem-results').html(html);
}

var setMiddle = function(props) {
	var source = $('#middle-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#middle-results').html(html);
}

var setHigh = function(props) {
	var source = $('#high-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#high-results').html(html);
}

var setMagistrate = function(props) {
	var source = $('#magistrate-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#magistrate-results').html(html);
}

var setHouse = function(props) {
	var source = $('#house-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#house-results').html(html);
}

var setSenate = function(props) {
	var source = $('#senate-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#senate-results').html(html);
}

var setSchoolBoard = function(props) {
	var source = $('#school-board-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#school-board-results').html(html);
}

var setVoting = function(props) {
	var source = $('#voting-template').html();
	var template = Handlebars.compile(source);
	var html = template(props);
	$('#voting-results').html(html);
}

var addressLookup = function(query) {
	geocoder.query(query, function(err, data){
		if (data.latlng) {
	        map.setView([data.latlng[0], data.latlng[1]], 16);
	        var point = getPoint(data.latlng[0], data.latlng[1]);
	        findDistricts(point);
	    }
	});
};

var findDistricts = function(point) {
	setCouncil(findCouncil(point));
	setElem(findElementary(point));
	setMiddle(findMiddle(point));
	setHigh(findHigh(point));
	setMagistrate(findMagistrate(point));
	setHouse(findHouse(point));
	setSenate(findSenate(point));
	setSchoolBoard(findSchoolBoard(point));
	setVoting(findVoting(point));
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
	load_data();
	countyLayer.addTo(map);
	
	countyLayer.on('click', function(e) {
		var point = getPoint(e.latlng.lat, e.latlng.lng);
		postOffice = findNearest(postOfficeLayer, point)
		setPostMarker(postOffice);
		findDistricts(point);
		
	});
	$('#search').on('click', function(e){
		e.preventDefault();
		addressLookup($('#search-address').val() + ' Lexington , KY');
	});
})