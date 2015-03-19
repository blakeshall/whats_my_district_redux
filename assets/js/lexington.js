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

var initVariables = function(){
    L.mapbox.accessToken = 'pk.eyJ1IjoiYmxha2VzaGFsbCIsImEiOiJRSkN3Y3prIn0.MfDnpigJE6CVbEsV0xwLfA';
    map;
    geocoder = L.mapbox.geocoder('mapbox.places');
    councilLayer = L.mapbox.featureLayer();
    elemLayer = L.mapbox.featureLayer();
    middleLayer = L.mapbox.featureLayer();
    highLayer = L.mapbox.featureLayer();
    magistrateLayer = L.mapbox.featureLayer();
    houseLayer = L.mapbox.featureLayer();
    senateLayer = L.mapbox.featureLayer();
    schoolBoardLayer = L.mapbox.featureLayer();
    votingLayer = L.mapbox.featureLayer();
    neighborhoodAssocLayer = L.mapbox.featureLayer();
    postOfficeLayer = L.mapbox.featureLayer();
    fireStationLayer = L.mapbox.featureLayer();
    libraryLayer = L.mapbox.featureLayer();
    hospitalLayer = L.mapbox.featureLayer();
    countyLayer = L.mapbox.featureLayer();
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
    lookupMarker.setOpacity(1);
    $('.temp').hide();
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

function createCookie(name, value, days) {
  var expires;

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

var setAddress = function(address) {
  $('#search-address').val(address);
};

$(document).ready(function(){
    setAddress(readCookie("query"));
    initVariables();

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
        var address = $('#search-address').val()
        createCookie("query", address);
        addressLookup(address + ' Lexington , KY');
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
