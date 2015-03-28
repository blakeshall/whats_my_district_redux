var map;
var geocoder;
var councilLayer;
var elemLayer;
var middleLayer;
var highLayer;
var magistrateLayer;
var houseLayer;
var senateLayer;
var schoolBoardLayer;
var votingLayer;
var neighborhoodAssocLayer;
var postOfficeLayer;
var fireStationLayer;
var libraryLayer;
var hospitalLayer;
var countyLayer;
var postMarker;
var fireMarker;
var libraryMarker;
var hospitalMarker;
var lookupMarker;
var layers = [];
var markers = [];

var initVariables = function(){
    // change accessToken to your Mapbox token
    // see: https://www.mapbox.com/account/apps/
    L.mapbox.accessToken = 'pk.eyJ1IjoiYmxha2VzaGFsbCIsImEiOiJRSkN3Y3prIn0.MfDnpigJE6CVbEsV0xwLfA';
    geocoder = L.mapbox.geocoder('mapbox.places');
    councilLayer = L.mapbox.featureLayer();
    layers.push(councilLayer);
    elemLayer = L.mapbox.featureLayer();
    layers.push(elemLayer);
    middleLayer = L.mapbox.featureLayer();
    layers.push(middleLayer);
    highLayer = L.mapbox.featureLayer();
    layers.push(highLayer);
    magistrateLayer = L.mapbox.featureLayer();
    layers.push(magistrateLayer);
    houseLayer = L.mapbox.featureLayer();
    layers.push(houseLayer);
    senateLayer = L.mapbox.featureLayer();
    layers.push(senateLayer);
    schoolBoardLayer = L.mapbox.featureLayer();
    layers.push(schoolBoardLayer);
    votingLayer = L.mapbox.featureLayer();
    layers.push(votingLayer);
    neighborhoodAssocLayer = L.mapbox.featureLayer();
    layers.push(neighborhoodAssocLayer);
    postOfficeLayer = L.mapbox.featureLayer();
    fireStationLayer = L.mapbox.featureLayer();
    libraryLayer = L.mapbox.featureLayer();
    hospitalLayer = L.mapbox.featureLayer();
    countyLayer = L.mapbox.featureLayer();
    layers.push(countyLayer);
    postMarker = L.mapbox.featureLayer();
    fireMarker = L.mapbox.featureLayer();
    libraryMarker = L.mapbox.featureLayer();
    hospitalMarker = L.mapbox.featureLayer();
    lookupMarker = L.marker([0, 0], {
    	"marker-color": "#3bb20"
    });
}

var loadData = function(){
    councilLayer.loadURL('assets/data/council.geojson');
      //   .on('ready', function(data){
      //   	councilLayer.eachLayer(function(layer) {
    		// 	layer.bindPopup('District: <strong>' + layer.feature.properties.DISTRICT + '</strong>', { closeButton: false});
    		// });
      //   });
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

var findDistricts = function(point) {
    var postOffice = findNearest(postOfficeLayer, point)
    var fireStation = findNearest(fireStationLayer, point);
    var library = findNearest(libraryLayer, point);
    var hospital = findNearest(hospitalLayer, point);
    setMarker(map, postOffice, postMarker, {
        color: '#63b6e5',
        icon: 'post',
        size: 'small',
        title: postOffice.properties.NAME,
        description: postOffice.properties.ADDRESS
    });
    setMarker(map, fireStation, fireMarker, {
        color: '#FF0000',
        icon: 'fire-station',
        size: 'small',
        title: fireStation.properties.MORE,
        description: fireStation.properties.ADDRESS
    });
    setMarker(map, library, libraryMarker,{
      color: '#57FF65',
      icon: 'library',
      size: 'small',
      title: library.properties.NAME,
      description: library.properties.ADDRESS
    });
    setMarker(map, hospital, hospitalMarker,{
        color: '#FFFFFF',
        icon: 'hospital',
        size: 'small',
        title: hospital.properties.NAME,
        description: hospital.properties.ADDRESS
    });
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
    setLayerListeners();

};

var addressLookup = function(query) {
    geocoder.query(query, function(err, data){
        if (data.latlng) {
            map.setView([data.latlng[0], data.latlng[1]], 13);
            var point = getPoint(data.latlng[0], data.latlng[1]);
            findDistricts(point);
        }
    });
};

var clearLayers = function() {
    if(map.hasLayer(countyLayer)){
        map.removeLayer(countyLayer);
    }
    layers.forEach(function(layer){
        if(map.hasLayer(layer)){
            map.removeLayer(layer);
        }
    });
};

var reset = function(){
    clearLayers();
    countyLayer.addTo(map);
}

var setLayerListeners = function(){
    $('#show-council').on('click', function(e){
        clearLayers();
        councilLayer.addTo(map);
        return false;
    });
    $('#show-house').on('click', function(e){
        clearLayers();
        houseLayer.addTo(map);
        return false;
    });
    $('#show-senate').on('click', function(e){
        clearLayers();
        senateLayer.addTo(map);
        return false;
    });
    $('#show-magistrate').on('click', function(e){
        clearLayers();
        magistrateLayer.addTo(map);
        return false;
    });
    $('#show-elem').on('click', function(e){
        clearLayers();
        elemLayer.addTo(map);
        return false;
    });
    $('#show-middle').on('click', function(e){
        clearLayers();
        middleLayer.addTo(map);
        return false;
    });
    $('#show-high').on('click', function(e){
        clearLayers();
        highLayer.addTo(map);
        return false;
    });
    $('#show-school-board').on('click', function(e){
        clearLayers();
        schoolBoardLayer.addTo(map);
        return false;
    });
    $('#show-voting').on('click', function(e){
        clearLayers();
        votingLayer.addTo(map);
        return false;
    });
}

$(document).ready(function(){
    initVariables();

    map = L.mapbox.map('map', 'mapbox.light')
        .setView([38.05, -84.5], 12);

    lookupMarker.setOpacity(0)
    lookupMarker.addTo(map);
    loadData();
    countyLayer.addTo(map);
    
    layers.forEach(function(layer){
        layer.on('click', function(e){
            var point = getPoint(e.latlng.lat, e.latlng.lng);
            findDistricts(point);
        });
    });
    $('#search').on('click', function(e){
        e.preventDefault();
        addressLookup($('#search-address').val() + ' Lexington , KY');
    });

    postMarker.on('mouseover', function(e){
        e.layer.openPopup();
    });
    fireMarker.on('mouseover', function(e){
        e.layer.openPopup();
    });
    libraryMarker.on('mouseover', function(e){
        e.layer.openPopup();
    });
    hospitalMarker.on('mouseover', function(e){
        e.layer.openPopup();
    });
})