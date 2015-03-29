var map;
var geocoder;

var countyLayer;

var lookupMarker;
var layers = [];
var markerLayers = [];

var initVariables = function(){
    // change accessToken to your Mapbox token
    // see: https://www.mapbox.com/account/apps/
    L.mapbox.accessToken = 'pk.eyJ1IjoiYmxha2VzaGFsbCIsImEiOiJRSkN3Y3prIn0.MfDnpigJE6CVbEsV0xwLfA';
    geocoder = L.mapbox.geocoder('mapbox.places');
    countyLayer = L.mapbox.featureLayer();
    countyLayer.loadURL('assets/data/county.geojson')
    markerLayers.push(new WhatsMyDistrict.PointLayer('assets/data/post-office.geojson', {color: '#63b6e5', icon: 'post', size: 'small'}))
    markerLayers.push(new WhatsMyDistrict.PointLayer('assets/data/fire-station.geojson', {color: '#FF0000', icon: 'fire-station' , size: 'small'}))
    markerLayers.push(new WhatsMyDistrict.PointLayer('assets/data/library.geojson', {color: '#57FF65', icon: 'library' , size: 'small'}))
    markerLayers.push(new WhatsMyDistrict.PointLayer('assets/data/hospital.geojson', {color: '#FFFFFF', icon: 'hospital' , size: 'small'}))

    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/council.geojson', '#council-template', '#council-results'))
    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/elem.geojson', '#elem-template', '#elem-results'))
    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/middle.geojson', '#middle-template', '#middle-results'))
    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/high.geojson', '#high-template', '#high-results'))
    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/magistrate.geojson', '#magistrate-template', '#magistrate-results'))
    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/house.geojson', '#house-template', '#house-results'))
    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/senate.geojson', '#senate-template', '#senate-results'))
    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/school-board.geojson', '#school-board-template', '#school-board-results'))
    layers.push(new WhatsMyDistrict.DistrictLayer('assets/data/voting.geojson', '#voting-template', '#voting-results'))
    lookupMarker = L.marker([0, 0], {
    	"marker-color": "#3bb20"
    });
}

var findDistricts = function(point) {
    markerLayers.forEach(function(marker){
        marker.setMarker(map, marker.findNearest(point))
    })

    layers.forEach(function(layer){
        layer.setTemplate(layer.findDistrict(point))
    })
    lookupMarker.setLatLng([point.geometry.coordinates[1], point.geometry.coordinates[0]]);
    lookupMarker.setOpacity(1)
    // setLayerListeners();

};

var addressLookup = function(query) {
    geocoder.query(query, function(err, data){
        if (data.latlng) {
            map.setView([data.latlng[0], data.latlng[1]], 13);
            var point = WhatsMyDistrict.getPoint(data.latlng[0], data.latlng[1]);
            findDistricts(point);
        }
    });
};

var clearLayers = function() {
    if(map.hasLayer(countyLayer)){
        map.removeLayer(countyLayer);
    }
    layers.forEach(function(layer){
        if(map.hasLayer(this.featureLayer)){
            map.removeLayer(this.featureLayer);
        }
    });
};

var reset = function(){
    clearLayers();
    countyLayer.addTo(map);
}

$(document).ready(function(){
    initVariables();

    map = L.mapbox.map('map', 'mapbox.light')
        .setView([38.05, -84.5], 12);

    lookupMarker.setOpacity(0)
    lookupMarker.addTo(map);
    countyLayer.addTo(map);
    countyLayer.on('click', function(e){
        var point = WhatsMyDistrict.getPoint(e.latlng.lat, e.latlng.lng);
        findDistricts(point);
    })
    layers.forEach(function(layer){
        layer.featureLayer.on('click', function(e){
            var point = WhatsMyDistrict.getPoint(e.latlng.lat, e.latlng.lng);
            findDistricts(point);
        });
    });
    markerLayers.forEach(function(marker){
        marker.markerLayer.on('mouseover', function(e){
            e.layer.openPopup();
        })
    })
    $('#search').on('click', function(e){
        e.preventDefault();
        addressLookup($('#search-address').val() + ' Lexington , KY');
    });
})